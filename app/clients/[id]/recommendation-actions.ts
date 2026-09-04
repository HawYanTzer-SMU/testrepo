'use server'

import { revalidatePath } from 'next/cache'
import { transitionRecommendation, updateRecommendation } from '@/services/recommendations'
import type { RecommendationEventType } from '@/lib/supabase/types'

const RM_NAME = 'Priscilla Ong'

export async function editRecommendationAction(clientId: string, recommendationId: string, text: string) {
  if (!text.trim()) throw new Error('Recommendation cannot be empty.')
  await updateRecommendation(recommendationId, { recommendation: text.trim() })
  revalidatePath(`/clients/${clientId}`)
}

export async function transitionRecommendationAction(
  clientId: string,
  recommendationId: string,
  eventType: RecommendationEventType,
  notes?: string,
) {
  await transitionRecommendation(recommendationId, eventType, { notes: notes ?? null, createdBy: RM_NAME })
  revalidatePath(`/clients/${clientId}`)
  revalidatePath('/actions')
  revalidatePath('/ledger')
  revalidatePath('/')
}
