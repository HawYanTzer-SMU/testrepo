'use client'

import * as React from 'react'
import { CalculatorIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { lauInsight } from '@/lib/data'
import { MetricCard } from './metric-card'
import { SourceCitation, SystemLabel, AssistLabel } from './source-citation'
import { LtvThresholdBar } from './ltv-threshold-bar'

export function InsightPanel() {
  const [open, setOpen] = React.useState(false)

  return (
    <section
      aria-labelledby="insight-heading"
      className="rounded-lg border border-signal-critical/25 bg-card"
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="insight-heading" className="text-[11px] font-semibold tracking-[0.1em] text-signal-critical uppercase">
              What you need to know
            </h2>
            <p className="max-w-3xl font-serif text-xl leading-snug text-pretty">{lauInsight.message}</p>
          </div>
          <AssistLabel>Summary drafted by assistant</AssistLabel>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lauInsight.metrics.map((m, i) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              source={m.source}
              asOf={m.asOf}
              tone={i === 0 ? 'critical' : 'default'}
              className="bg-background"
            />
          ))}
        </div>

        <LtvThresholdBar current={69.41} warning={65} liquidation={70} />
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between border-t px-6 py-3">
          <CollapsibleTrigger
            render={<Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" />}
          >
            <CalculatorIcon data-icon="inline-start" />
            View calculation and sources
            <ChevronDownIcon
              data-icon="inline-end"
              className={cn('transition-transform', open && 'rotate-180')}
            />
          </CollapsibleTrigger>
          <SystemLabel>Figures are system-calculated</SystemLabel>
        </div>

        <CollapsibleContent>
          <div className="border-t bg-surface px-6 py-5">
            <p className="mb-4 text-xs text-muted-foreground">
              Every figure in this panel is computed from source systems. The assistant only wrote the
              summary sentence above; it did not calculate any value.
            </p>
            <ol className="flex flex-col divide-y rounded-md border bg-card">
              {lauInsight.calculation.map((row, i) => (
                <li
                  key={row.step}
                  className="grid grid-cols-[28px_1fr_auto] items-start gap-4 px-4 py-3 text-sm md:grid-cols-[28px_200px_1fr_auto]"
                >
                  <span className="tabular pt-px text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{row.step}</span>
                  <span className="hidden text-muted-foreground md:block">{row.detail}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="tabular font-mono text-[13px]">{row.value}</span>
                    <SourceCitation source={row.source} compact />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
