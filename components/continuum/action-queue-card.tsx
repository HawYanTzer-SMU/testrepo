'use client'

import * as React from 'react'
import { FileTextIcon, ShieldAlertIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActionItem } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './priority-badge'
import { ActionReviewDrawer } from './action-review-drawer'

const statusStyles: Record<ActionItem['status'], string> = {
  'Awaiting Review': 'bg-primary/8 text-primary border-primary/25',
  Approved: 'bg-signal-positive-muted text-signal-positive border-signal-positive/30',
  Deferred: 'bg-signal-warning-muted text-signal-warning-foreground border-signal-warning/40',
  Completed: 'bg-secondary text-secondary-foreground border-border',
  Rejected: 'bg-muted text-muted-foreground border-border',
}

export function ActionQueueCard({
  action,
  onDecision,
}: {
  action: ActionItem
  onDecision: (id: string, decision: 'Approved' | 'Deferred' | 'Rejected') => void
}) {
  const [open, setOpen] = React.useState(false)
  const editable = action.status === 'Awaiting Review'

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight">{action.client}</h3>
              <PriorityBadge priority={action.priority} size="sm" />
              <span className="text-xs text-muted-foreground">{action.type}</span>
            </div>
            <p className="text-sm font-medium text-foreground/90">{action.workflow}</p>
          </div>
          <span
            className={cn(
              'inline-flex h-6 shrink-0 items-center rounded-sm border px-2 text-xs font-medium',
              statusStyles[action.status],
            )}
          >
            {action.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {action.prepared.map((p) => (
            <span
              key={p}
              className="inline-flex h-6 items-center gap-1 rounded-sm border bg-surface px-1.5 text-[11px] text-muted-foreground"
            >
              <FileTextIcon className="size-3" />
              {p}
            </span>
          ))}
        </div>

        {action.compliance ? (
          <p className="flex items-center gap-1.5 text-xs text-signal-warning-foreground">
            <ShieldAlertIcon className="size-3.5" />
            {action.compliance}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            {action.due ? `Due ${action.due} · ` : ''}Created {action.created}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Review
            </Button>
            {editable ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => onDecision(action.id, 'Approved')}>
                  Approve
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDecision(action.id, 'Deferred')}>
                  Defer
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </article>

      <ActionReviewDrawer action={action} open={open} onOpenChange={setOpen} onDecision={onDecision} />
    </>
  )
}
