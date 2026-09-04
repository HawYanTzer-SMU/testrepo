'use client'

import * as React from 'react'
import { CheckIcon, CircleIcon, PenLineIcon } from 'lucide-react'
import type { ActionItem } from '@/lib/data'
import { cn } from '@/lib/utils'
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
import { SourceCitation, AssistLabel } from './source-citation'

export function ActionReviewDrawer({
  action,
  open,
  onOpenChange,
  onDecision,
}: {
  action: ActionItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onDecision: (id: string, decision: 'Approved' | 'Deferred' | 'Rejected') => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [message, setMessage] = React.useState(action.message ?? '')
  const [checked, setChecked] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setMessage(action.message ?? '')
    setChecked({})
    setEditing(false)
  }, [action.id, action.message])

  function decide(decision: 'Approved' | 'Deferred' | 'Rejected') {
    onDecision(action.id, decision)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{action.workflow}</SheetTitle>
          <SheetDescription>
            {action.client} · {action.type}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-5">
          <section className="flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Proposed action
            </h4>
            <p className="text-sm font-medium">{action.workflow}</p>
          </section>

          {action.message ? (
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Generated client message
                </h4>
                <AssistLabel>AI-drafted</AssistLabel>
              </div>
              {editing ? (
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="text-sm"
                />
              ) : (
                <p className="rounded-md border bg-surface p-3 text-sm leading-relaxed text-pretty text-foreground/90">
                  {message}
                </p>
              )}
              <Button variant="ghost" size="sm" className="w-fit text-muted-foreground" onClick={() => setEditing((v) => !v)}>
                <PenLineIcon data-icon="inline-start" />
                {editing ? 'Done editing' : 'Edit message'}
              </Button>
            </section>
          ) : null}

          {action.evidence?.length ? (
            <section className="flex flex-col gap-2">
              <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Supporting evidence
              </h4>
              <dl className="flex flex-col divide-y rounded-md border bg-card">
                {action.evidence.map((e) => (
                  <div key={e.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{e.label}</dt>
                    <dd className="flex items-center gap-2">
                      <span className="tabular font-medium">{e.value}</span>
                      <SourceCitation source={e.source} compact />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <section className="flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Required approvals
            </h4>
            <ul className="flex flex-col divide-y rounded-md border bg-card">
              {action.approvals.map((a) => {
                const isChecked = checked[a.label] ?? a.done
                return (
                  <li key={a.label}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [a.label]: !isChecked }))}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm"
                    >
                      {isChecked ? (
                        <CheckIcon className="size-4 shrink-0 text-signal-positive" />
                      ) : (
                        <CircleIcon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={cn(isChecked && 'text-muted-foreground line-through')}>{a.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {action.compliance ? (
              <p className="text-xs text-muted-foreground">{action.compliance}</p>
            ) : null}
          </section>

          <p className="text-xs text-muted-foreground">
            Approving here does not send anything automatically. The RM confirms this decision explicitly;
            client communication and execution require this record as evidence of approval.
          </p>
        </div>

        <SheetFooter className="mt-0 flex-row flex-wrap gap-2 border-t px-5 py-4">
          <Button className="flex-1" onClick={() => decide('Approved')}>
            Approve
          </Button>
          <Button variant="outline" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="outline" onClick={() => decide('Deferred')}>
            Defer
          </Button>
          <Button variant="destructive" onClick={() => decide('Rejected')}>
            Reject
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
