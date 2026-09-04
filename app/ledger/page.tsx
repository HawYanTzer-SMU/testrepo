'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'
import { adviceLedger, type LedgerRow } from '@/lib/data'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/continuum/page-header'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdviceStatusBadge } from '@/components/continuum/advice-status-badge'
import { ResurfacedAdviceBanner } from '@/components/continuum/resurfaced-advice-banner'
import { LedgerHistoryDrawer } from '@/components/continuum/ledger-history-drawer'

export default function AdviceLedgerPage() {
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState<LedgerRow | null>(null)
  const [open, setOpen] = React.useState(false)

  const filtered = adviceLedger.filter((r) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      r.client.toLowerCase().includes(q) ||
      r.recommendation.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    )
  })

  const resurfaced = adviceLedger.filter((r) => r.highlighted && r.status === 'Resurfaced')

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        title="Advice Ledger"
        subtitle="Recommendations should not disappear after one conversation."
      />

      {resurfaced.map((r) => (
        <ResurfacedAdviceBanner key={r.id}>
          <span className="font-medium">
            {r.client} — “{r.recommendation}”
          </span>{' '}
          was deferred on {r.created} (outcome: Deferred, trigger “{r.reviewTrigger}”). Previous advice resurfaced
          because its review condition has been met — current value trending against target.
        </ResurfacedAdviceBanner>
      ))}

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search client, recommendation or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 bg-card pl-8 text-[13px]"
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[13%]">Client</TableHead>
              <TableHead className="w-[22%]">Recommendation</TableHead>
              <TableHead className="w-[13%]">Category</TableHead>
              <TableHead className="w-[9%]">Created</TableHead>
              <TableHead className="w-[11%]">Status</TableHead>
              <TableHead className="w-[10%]">Next review</TableHead>
              <TableHead className="w-[13%]">Review trigger</TableHead>
              <TableHead className="w-[9%]">Last action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  setSelected(row)
                  setOpen(true)
                }}
                className={cn(
                  'cursor-pointer',
                  row.highlighted && 'border-l-2 border-l-signal-critical bg-signal-critical-muted/40',
                )}
              >
                <TableCell className="font-medium whitespace-normal">{row.client}</TableCell>
                <TableCell className="text-xs whitespace-normal">{row.recommendation}</TableCell>
                <TableCell className="text-xs whitespace-normal text-muted-foreground">{row.category}</TableCell>
                <TableCell className="text-xs whitespace-normal text-muted-foreground">{row.created}</TableCell>
                <TableCell>
                  <AdviceStatusBadge status={row.status} size="sm" />
                </TableCell>
                <TableCell className="text-xs whitespace-normal text-muted-foreground">{row.nextReview}</TableCell>
                <TableCell className="text-xs whitespace-normal text-muted-foreground">{row.reviewTrigger}</TableCell>
                <TableCell className="text-xs whitespace-normal text-muted-foreground">{row.lastAction}</TableCell>
              </TableRow>
            ))}
            {!filtered.length ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No recommendations match “{query}”.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <LedgerHistoryDrawer row={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}
