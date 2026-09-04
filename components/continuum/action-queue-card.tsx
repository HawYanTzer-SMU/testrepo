'use client'

import * as React from 'react'
import Link from 'next/link'
import { FileTextIcon, RotateCcwIcon, ShieldAlertIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecommendationWithClient } from '@/services/recommendations'
import { toActionStatus, toPriorityBadge, toCategoryLabel } from '@/lib/recommendation-display'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './priority-badge'
import { ActionReviewDrawer } from './action-review-drawer'
import { transitionAction } from '@/app/actions/actions'
import type { ActionStatus } from '@/lib/data'

const statusStyles: Record<ActionStatus, string> = {
  'Awaiting Review': 'bg-primary/8 text-primary border-primary/25',
  Approved: 'bg-signal-positive-muted text-signal-positive border-signal-positive/30',
  Deferred: 'bg-signal-warning-muted text-signal-warning-foreground border-signal-warning/40',
  Completed: 'bg-secondary text-secondary-foreground border-border',
  Rejected: 'bg-muted text-muted-foreground border-border',
}

export function ActionQueueCard({ recommendation }: { recommendation: RecommendationWithClient }) {
  const [open, setOpen] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const status = toActionStatus(recommendation.status)
  const editable = status === 'Awaiting Review'
  const isDeferred = recommendation.status === 'DEFERRED'

  function decide(eventType: 'APPROVED' | 'CLIENT_DEFERRED' | 'RESURFACED') {
    startTransition(async () => {
      await transitionAction(recommendation.id, eventType)
    })
  }

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/clients/${recommendation.client_id}`} className="text-base font-semibold tracking-tight hover:underline underline-offset-4">
                {recommendation.client_name}
              </Link>
              <PriorityBadge priority={toPriorityBadge(recommendation.priority)} size="sm" />
              <span className="text-xs text-muted-foreground">{toCategoryLabel(recommendation.insight_type)}</span>
            </div>
            <p className="text-sm font-medium text-foreground/90">{recommendation.title}</p>
          </div>
          <span
            className={cn(
              'inline-flex h-6 shrink-0 items-center rounded-sm border px-2 text-xs font-medium',
              statusStyles[status],
            )}
          >
            {status}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileTextIcon className="size-3" />
          {recommendation.recommendation}
        </p>

        {recommendation.priority === 'Urgent' ? (
          <p className="flex items-center gap-1.5 text-xs text-signal-warning-foreground">
            <ShieldAlertIcon className="size-3.5" />
            Specialist approval required
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">Created {new Date(recommendation.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Review
            </Button>
            {editable ? (
              <>
                <Button size="sm" onClick={() => decide('APPROVED')} disabled={pending}>
                  Approve
                </Button>
                <Button variant="ghost" size="sm" onClick={() => decide('CLIENT_DEFERRED')} disabled={pending}>
                  Defer
                </Button>
              </>
            ) : null}
            {isDeferred ? (
              <Button size="sm" onClick={() => decide('RESURFACED')} disabled={pending}>
                <RotateCcwIcon data-icon="inline-start" />
                Resurface
              </Button>
            ) : null}
          </div>
        </div>
      </article>

      <ActionReviewDrawer recommendation={recommendation} open={open} onOpenChange={setOpen} />
    </>
  )
}
