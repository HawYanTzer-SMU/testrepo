'use client'

import * as React from 'react'
import { ChevronDownIcon, NetworkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { lauKeystone } from '@/lib/data'
import { SourceCitation, AssistLabel, SystemLabel } from './source-citation'

const shades = ['bg-primary', 'bg-primary/75', 'bg-primary/50', 'bg-primary/30']

export function KeystoneInsight() {
  const [open, setOpen] = React.useState(false)
  const total = lauKeystone.breakdown.reduce((a, b) => a + b.pct, 0)

  return (
    <section aria-labelledby="keystone-heading" className="rounded-lg border bg-card">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <NetworkIcon className="size-4 text-muted-foreground" />
            <h3 id="keystone-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Keystone insight · {lauKeystone.title}
            </h3>
          </div>
          <AssistLabel>Statement drafted</AssistLabel>
        </div>

        <p className="font-serif text-lg leading-snug text-pretty">{lauKeystone.statement}</p>

        {/* stacked bar */}
        <div className="flex flex-col gap-2">
          <div className="flex h-3 overflow-hidden rounded-sm bg-muted" role="img" aria-label={`${total}% connected exposure`}>
            {lauKeystone.breakdown.map((b, i) => (
              <div key={b.label} className={cn(shades[i])} style={{ width: `${(b.pct / total) * 100}%` }} />
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {lauKeystone.breakdown.map((b, i) => (
              <div key={b.label} className="flex items-start gap-2">
                <span aria-hidden className={cn('mt-1 size-2 shrink-0 rounded-sm', shades[i])} />
                <div className="min-w-0">
                  <dd className="tabular text-base font-medium leading-none">{b.pct}%</dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{b.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between border-t px-5 py-2.5">
          <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" />}>
            Show working
            <ChevronDownIcon data-icon="inline-end" className={cn('transition-transform', open && 'rotate-180')} />
          </CollapsibleTrigger>
          <SystemLabel>Percentages system-calculated</SystemLabel>
        </div>
        <CollapsibleContent>
          <div className="border-t bg-surface p-5">
            <p className="mb-3 text-xs text-muted-foreground">
              Denominator: liquid wealth HKD 184.0m (Holdings, 04 Sep 2026 close). Look-through applied to funds
              and structured products using latest available underlying data.
            </p>
            <ul className="flex flex-col divide-y rounded-md border bg-card">
              {lauKeystone.breakdown.map((b) => (
                <li key={b.label} className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2.5 text-sm md:grid-cols-[200px_1fr_auto_auto]">
                  <span className="font-medium">{b.label}</span>
                  <span className="hidden text-muted-foreground md:block">{b.detail}</span>
                  <span className="tabular font-mono text-[13px]">{b.pct}%</span>
                  <SourceCitation source={b.source} compact className="hidden md:inline-flex" />
                </li>
              ))}
              <li className="grid grid-cols-[1fr_auto] items-center gap-4 bg-muted/40 px-4 py-2.5 text-sm md:grid-cols-[200px_1fr_auto_auto]">
                <span className="font-semibold">Total connected exposure</span>
                <span className="hidden md:block" />
                <span className="tabular font-mono text-[13px] font-semibold">{total}%</span>
                <span className="hidden md:block" />
              </li>
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
