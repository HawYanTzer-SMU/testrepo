import { getSupabaseClient } from "@/lib/supabase/server"
import type {
  InsightType,
  Recommendation,
  RecommendationEvent,
  RecommendationEventType,
  RecommendationPriority,
  RecommendationStatus,
} from "@/lib/supabase/types"

export type RecommendationWithClient = Recommendation & { client_name: string; insight_type: InsightType | null }

/** All recommendations across every client, for the Action Queue / Advice Ledger. */
export async function listRecommendations(): Promise<RecommendationWithClient[]> {
  const { data, error } = await getSupabaseClient()
    .from("recommendations")
    .select("*, clients(client_name), insights(insight_type)")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`listRecommendations: ${error.message}`)
  return (
    data as unknown as (Recommendation & {
      clients: { client_name: string } | null
      insights: { insight_type: InsightType } | null
    })[]
  ).map((r) => {
    const { clients, insights, ...rest } = r
    return { ...rest, client_name: clients?.client_name ?? "Unknown client", insight_type: insights?.insight_type ?? null }
  })
}

export async function getRecommendations(clientId: string): Promise<Recommendation[]> {
  const { data, error } = await getSupabaseClient()
    .from("recommendations")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`getRecommendations(${clientId}): ${error.message}`)
  return data as Recommendation[]
}

export async function getRecommendationById(id: string): Promise<Recommendation | null> {
  const { data, error } = await getSupabaseClient().from("recommendations").select("*").eq("id", id).maybeSingle()

  if (error) throw new Error(`getRecommendationById(${id}): ${error.message}`)
  return data as Recommendation | null
}

export interface CreateRecommendationInput {
  client_id: string
  insight_id?: string | null
  title: string
  recommendation: string
  rationale?: string | null
  priority?: RecommendationPriority
  status?: RecommendationStatus
  created_by?: string | null
}

/** Creates a recommendation and its opening CREATED lifecycle event. */
export async function createRecommendation(input: CreateRecommendationInput): Promise<Recommendation> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      client_id: input.client_id,
      insight_id: input.insight_id ?? null,
      title: input.title,
      recommendation: input.recommendation,
      rationale: input.rationale ?? null,
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.status ? { status: input.status } : {}),
    })
    .select()
    .single()
  if (error) throw new Error(`createRecommendation: ${error.message}`)

  const recommendation = data as Recommendation
  const { error: eventError } = await supabase.from("recommendation_events").insert({
    recommendation_id: recommendation.id,
    event_type: "CREATED" satisfies RecommendationEventType,
    notes: null,
    created_by: input.created_by ?? null,
  })
  if (eventError) throw new Error(`createRecommendation event: ${eventError.message}`)

  return recommendation
}

export type UpdateRecommendationInput = Partial<
  Pick<Recommendation, "title" | "recommendation" | "rationale" | "priority">
>

export async function updateRecommendation(id: string, updates: UpdateRecommendationInput): Promise<Recommendation> {
  const { data, error } = await getSupabaseClient()
    .from("recommendations")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`updateRecommendation(${id}): ${error.message}`)
  return data as Recommendation
}

/** Batch-loads events for many recommendations in one query, grouped by recommendation_id. */
export async function getEventsForRecommendations(
  recommendationIds: string[],
): Promise<Record<string, RecommendationEvent[]>> {
  if (recommendationIds.length === 0) return {}

  const { data, error } = await getSupabaseClient()
    .from("recommendation_events")
    .select("*")
    .in("recommendation_id", recommendationIds)
    .order("created_at", { ascending: true })

  if (error) throw new Error(`getEventsForRecommendations: ${error.message}`)

  const grouped: Record<string, RecommendationEvent[]> = {}
  for (const event of data as RecommendationEvent[]) {
    ;(grouped[event.recommendation_id] ??= []).push(event)
  }
  return grouped
}

export async function getRecommendationEvents(recommendationId: string): Promise<RecommendationEvent[]> {
  const { data, error } = await getSupabaseClient()
    .from("recommendation_events")
    .select("*")
    .eq("recommendation_id", recommendationId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(`getRecommendationEvents(${recommendationId}): ${error.message}`)
  return data as RecommendationEvent[]
}

export interface AddRecommendationEventInput {
  event_type: RecommendationEventType
  notes?: string | null
  created_by?: string | null
}

export async function addRecommendationEvent(
  recommendationId: string,
  input: AddRecommendationEventInput,
): Promise<RecommendationEvent> {
  const { data, error } = await getSupabaseClient()
    .from("recommendation_events")
    .insert({
      recommendation_id: recommendationId,
      event_type: input.event_type,
      notes: input.notes ?? null,
      created_by: input.created_by ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`addRecommendationEvent(${recommendationId}): ${error.message}`)
  return data as RecommendationEvent
}

const STATUS_FOR_EVENT: Partial<Record<RecommendationEventType, RecommendationStatus>> = {
  RM_REVIEWED: "READY_FOR_REVIEW",
  APPROVED: "APPROVED",
  SENT: "SENT",
  CLIENT_ACCEPTED: "ACCEPTED",
  CLIENT_REJECTED: "REJECTED",
  CLIENT_DEFERRED: "DEFERRED",
  RESURFACED: "READY_FOR_REVIEW",
  COMPLETED: "CLOSED",
}

/**
 * The one function the Action Queue / Advice Ledger UI calls for every
 * lifecycle action: updates recommendations.status and appends the matching
 * recommendation_events row, so status and history can never drift apart.
 */
export async function transitionRecommendation(
  recommendationId: string,
  eventType: RecommendationEventType,
  options: { notes?: string | null; createdBy?: string | null } = {},
): Promise<{ recommendation: Recommendation; event: RecommendationEvent }> {
  const supabase = getSupabaseClient()
  const nextStatus = STATUS_FOR_EVENT[eventType]

  let recommendation: Recommendation
  if (nextStatus) {
    const { data, error } = await supabase
      .from("recommendations")
      .update({ status: nextStatus })
      .eq("id", recommendationId)
      .select()
      .single()
    if (error) throw new Error(`transitionRecommendation(${recommendationId}) status: ${error.message}`)
    recommendation = data as Recommendation
  } else {
    const existing = await getRecommendationById(recommendationId)
    if (!existing) throw new Error(`transitionRecommendation(${recommendationId}): not found`)
    recommendation = existing
  }

  const event = await addRecommendationEvent(recommendationId, {
    event_type: eventType,
    notes: options.notes ?? null,
    created_by: options.createdBy ?? null,
  })

  return { recommendation, event }
}
