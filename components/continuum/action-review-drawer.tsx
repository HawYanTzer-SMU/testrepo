'use client'

import * as React from 'react'
import { PenLineIcon, RotateCcwIcon } from 'lucide-react'
import type { RecommendationWithClient } from '@/services/recommendations'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { AssistLabel } from './source-citation'
import { transitionAction, editRecommendationMessageAction } from '@/app/actions/actions'

export function ActionReviewDrawer({
  recommendation,
  open,
  onOpenChange,
}: {
  recommendation: RecommendationWithClient
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [pending, startTransition] = React.useTransition()
  const [editing, setEditing] = React.useState(false)
  const [message, setMessage] = React.useState(recommendation.recommendation)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMessage(recommendation.recommendation)
    setEditing(false)
  }, [recommendation.id, recommendation.recommendation])

  function saveEdit() {
    setError(null)
    startTransition(async () => {
      try {
        await editRecommendationMessageAction(recommendation.id, message)
        setEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.')
      }
    })
  }

  function decide(eventType: 'APPROVED' | 'CLIENT_DEFERRED' | 'CLIENT_REJECTED' | 'RESURFACED') {
    startTransition(async () => {
      await transitionAction(recommendation.id, eventType)
      onOpenChange(false)
    })
  }

  const isDeferred = recommendation.status === 'DEFERRED'
  const isTerminal = ['REJECTED', 'CLOSED'].includes(recommendation.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{recommendation.title}</SheetTitle>
          <SheetDescription>{recommendation.client_name}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-5">
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Recommended action
              </h4>
              <AssistLabel>Drafted, RM-editable</AssistLabel>
            </div>
            {editing ? (
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="text-sm" />
            ) : (
              <p className="rounded-md border bg-surface p-3 text-sm leading-relaxed text-pretty text-foreground/90">
                {message}
              </p>
            )}
            {error ? <p className="text-xs text-signal-critical">{error}</p> : null}
            <Button variant="ghost" size="sm" className="w-fit text-muted-foreground" onClick={() => (editing ? saveEdit() : setEditing(true))} disabled={pending}>
              <PenLineIcon data-icon="inline-start" />
              {editing ? 'Save' : 'Edit message'}
            </Button>
          </section>

          {recommendation.rationale ? (
            <section className="flex flex-col gap-2">
              <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Rationale</h4>
              <p className="text-sm text-foreground/90">{recommendation.rationale}</p>
            </section>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Approving here does not send anything automatically. It records an RM decision on this recommendation;
            client communication and execution happen outside this system.
          </p>
        </div>

        {isDeferred && (
          <SheetFooter className="mt-0 flex-row flex-wrap gap-2 border-t px-5 py-4">
            <Button className="flex-1" onClick={() => decide('RESURFACED')} disabled={pending}>
              <RotateCcwIcon data-icon="inline-start" />
              Resurface
            </Button>
            <Button variant="destructive" onClick={() => decide('CLIENT_REJECTED')} disabled={pending}>
              Reject
            </Button>
          </SheetFooter>
        )}

        {!isDeferred && !isTerminal && (
          <SheetFooter className="mt-0 flex-row flex-wrap gap-2 border-t px-5 py-4">
            <Button className="flex-1" onClick={() => decide('APPROVED')} disabled={pending}>
              Approve
            </Button>
            <Button variant="outline" onClick={() => setEditing(true)} disabled={pending}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => decide('CLIENT_DEFERRED')} disabled={pending}>
              Defer
            </Button>
            <Button variant="destructive" onClick={() => decide('CLIENT_REJECTED')} disabled={pending}>
              Reject
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
