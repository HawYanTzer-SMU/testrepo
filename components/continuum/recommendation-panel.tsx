'use client'

import * as React from 'react'
import Link from 'next/link'
import { PenLineIcon, SendIcon, ClockIcon, XIcon, RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AssistLabel, SourceCitation } from './source-citation'
import { SpecialistReviewBadge } from './specialist-review-badge'
import { editRecommendationAction, transitionRecommendationAction } from '@/app/clients/[id]/recommendation-actions'
import type { InsightEvidence, Recommendation } from '@/lib/supabase/types'
import { formatDate } from '@/lib/recommendation-display'

function sourceTableToSystem(table: string): import('@/lib/data').SourceSystem {
  const map: Record<string, import('@/lib/data').SourceSystem> = {
    holdings: 'Holdings',
    credit_facilities: 'Credit Facility',
    credit_facility_snapshots: 'Credit Facility',
    mandate_allocations: 'Mandate',
    portfolios: 'Mandate',
    planned_cash_needs: 'CRM',
    rm_notes: 'RM Note',
  }
  return map[table] ?? 'Advice Ledger'
}

export function RecommendationPanel({
  clientId,
  recommendation,
  evidence,
}: {
  clientId: string
  recommendation: Recommendation | null
  evidence: InsightEvidence[]
}) {
  const [pending, startTransition] = React.useTransition()
  const [editing, setEditing] = React.useState(false)
  const [text, setText] = React.useState(recommendation?.recommendation ?? '')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setText(recommendation?.recommendation ?? '')
  }, [recommendation?.id, recommendation?.recommendation])

  if (!recommendation) {
    return (
      <section className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        No active recommendation for this client.{' '}
        <Link href="/actions" className="text-primary hover:underline underline-offset-4">
          Create one in the Action Queue
        </Link>
        .
      </section>
    )
  }

  function saveEdit() {
    setError(null)
    startTransition(async () => {
      try {
        await editRecommendationAction(clientId, recommendation!.id, text)
        setEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.')
      }
    })
  }

  function transition(eventType: 'RM_REVIEWED' | 'CLIENT_DEFERRED' | 'CLIENT_REJECTED' | 'RESURFACED') {
    setError(null)
    startTransition(async () => {
      try {
        await transitionRecommendationAction(clientId, recommendation!.id, eventType)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update.')
      }
    })
  }

  const isDeferred = recommendation.status === 'DEFERRED'
  const isTerminal = recommendation.status === 'REJECTED' || recommendation.status === 'CLOSED'

  return (
    <section aria-labelledby="rec-heading" className="rounded-lg border bg-card">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="rec-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Recommended response
          </h2>
          <AssistLabel>RM retains control</AssistLabel>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{recommendation.title}</p>
          {editing ? (
            <div className="flex flex-col gap-2">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="font-serif text-lg leading-snug" />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={saveEdit} disabled={pending}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="font-serif text-xl leading-snug text-pretty">{recommendation.recommendation}</p>
          )}
        </div>

        {error ? <p className="text-xs text-signal-critical">{error}</p> : null}

        {recommendation.rationale ? (
          <div className="flex flex-col gap-2 rounded-md border bg-surface p-4">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Why this is recommended
            </h4>
            <p className="text-sm text-foreground/90">{recommendation.rationale}</p>
          </div>
        ) : null}

        {evidence.length ? (
          <div className="flex flex-col gap-2 rounded-md border bg-surface p-4">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Supporting evidence
            </h4>
            <ul className="flex flex-col gap-1.5">
              {evidence.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 text-xs">
                  <span className="text-foreground/90">{e.description}</span>
                  <SourceCitation source={sourceTableToSystem(e.source_table)} compact className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {recommendation.priority === 'Urgent' || recommendation.priority === 'High' ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
            <SpecialistReviewBadge label={`${recommendation.priority} priority — specialist review recommended`} />
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Created {formatDate(recommendation.created_at)} · Status {recommendation.status.replace(/_/g, ' ')}. No client
          communication or action is executed without explicit RM approval in the Action Queue.
        </p>
      </div>

      {isDeferred && (
        <div className="flex flex-wrap items-center gap-2 border-t px-6 py-3">
          <p className="mr-auto text-xs text-muted-foreground">Previously deferred — condition may now apply again.</p>
          <Button size="sm" onClick={() => transition('RESURFACED')} disabled={pending}>
            <RotateCcwIcon data-icon="inline-start" />
            Resurface
          </Button>
          <Button variant="destructive" size="sm" onClick={() => transition('CLIENT_REJECTED')} disabled={pending}>
            <XIcon data-icon="inline-start" />
            Reject
          </Button>
        </div>
      )}

      {!isDeferred && !isTerminal && (
        <div className="flex flex-wrap items-center gap-2 border-t px-6 py-3">
          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)} disabled={pending}>
            <PenLineIcon data-icon="inline-start" />
            Edit Recommendation
          </Button>
          <Button size="sm" render={<Link href="/actions" />} nativeButton={false} className="ml-auto" onClick={() => transition('RM_REVIEWED')}>
            <SendIcon data-icon="inline-start" />
            Prepare Action
          </Button>
          <Button variant="outline" size="sm" onClick={() => transition('CLIENT_DEFERRED')} disabled={pending}>
            <ClockIcon data-icon="inline-start" />
            Defer
          </Button>
          <Button variant="destructive" size="sm" onClick={() => transition('CLIENT_REJECTED')} disabled={pending}>
            <XIcon data-icon="inline-start" />
            Reject
          </Button>
        </div>
      )}
    </section>
  )
}
