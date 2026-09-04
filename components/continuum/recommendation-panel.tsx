'use client'

import * as React from 'react'
import Link from 'next/link'
import { PenLineIcon, SendIcon, ClockIcon, XIcon } from 'lucide-react'
import { lauRecommendation } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AssistLabel, SourceCitation } from './source-citation'
import { TradeoffPanel } from './tradeoff-panel'
import { SpecialistReviewBadge } from './specialist-review-badge'

export function RecommendationPanel() {
  const [editing, setEditing] = React.useState(false)
  const [text, setText] = React.useState(lauRecommendation.primary)
  const [decision, setDecision] = React.useState<'deferred' | 'rejected' | null>(null)

  return (
    <section aria-labelledby="rec-heading" className="rounded-lg border bg-card">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="rec-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Recommended response
          </h2>
          <AssistLabel>AI-assisted, RM retains control</AssistLabel>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="font-serif text-lg leading-snug"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <p className="font-serif text-xl leading-snug text-pretty">{text}</p>
        )}

        {decision ? (
          <div className="flex items-center justify-between rounded-md border bg-surface px-4 py-2.5 text-sm">
            <span>
              This recommendation was <span className="font-medium">{decision}</span> by Sarah Lim. It remains
              visible in the Advice Ledger and may resurface if conditions change.
            </span>
            <Button variant="ghost" size="sm" onClick={() => setDecision(null)}>
              Undo
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-md border bg-surface p-4">
                <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Why this is recommended
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {lauRecommendation.reasons.map((r) => (
                    <li key={r.text} className="flex items-start justify-between gap-3 text-xs">
                      <span className="text-foreground/90">{r.text}</span>
                      <SourceCitation source={r.source} compact className="shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>

              <TradeoffPanel tradeoffs={lauRecommendation.tradeoffs} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
              <SpecialistReviewBadge label={lauRecommendation.specialistReview} />
              <p className="max-w-md text-right text-xs text-muted-foreground">
                Execution requires sign-off from a credit specialist in addition to RM approval.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 rounded-md bg-assist-muted p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Behaviour-aware communication
                </h4>
                <AssistLabel />
              </div>
              <p className="text-sm leading-relaxed text-pretty text-foreground">
                {lauRecommendation.communicationGuidance}
              </p>
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground">
          This panel provides recommendation support only. No client communication or action is executed without
          explicit RM approval in the Action Queue.
        </p>
      </div>

      {!decision && (
        <div className="flex flex-wrap items-center gap-2 border-t px-6 py-3">
          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
            <PenLineIcon data-icon="inline-start" />
            Edit Recommendation
          </Button>
          <Button size="sm" render={<Link href="/actions" />} nativeButton={false} className="ml-auto">
            <SendIcon data-icon="inline-start" />
            Prepare Action
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDecision('deferred')}>
            <ClockIcon data-icon="inline-start" />
            Defer
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDecision('rejected')}>
            <XIcon data-icon="inline-start" />
            Reject
          </Button>
        </div>
      )}
    </section>
  )
}
