import { LockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { lauPortfolio } from '@/lib/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SourceCitation } from '../source-citation'
import { MandateComparison } from '../mandate-comparison'

export function PortfolioTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <section aria-labelledby="alloc-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 id="alloc-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Allocation vs mandate
          </h3>
          <SourceCitation source="Holdings" asOf="04 Sep 2026" />
        </div>
        <div className="rounded-md border bg-card p-4">
          <p className="mb-4 text-xs text-muted-foreground">
            Total assets <span className="tabular font-medium text-foreground">{lauPortfolio.total}</span> · Balanced Growth mandate
          </p>
          <MandateComparison rows={lauPortfolio.allocation} />
        </div>
      </section>

      <section aria-labelledby="holdings-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 id="holdings-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Largest positions
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <LockIcon className="size-3" /> Pledged as collateral
          </span>
        </div>
        <div className="overflow-hidden rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">vs cost</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lauPortfolio.topHoldings.map((h) => (
                <TableRow key={h.name}>
                  <TableCell>
                    <p className="font-medium">{h.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{h.ticker}</p>
                  </TableCell>
                  <TableCell className="tabular text-right">{h.value}</TableCell>
                  <TableCell
                    className={cn(
                      'tabular text-right',
                      h.pnl.startsWith('−') && 'text-signal-critical',
                      h.pnl.startsWith('+') && 'text-signal-positive',
                    )}
                  >
                    {h.pnl}
                  </TableCell>
                  <TableCell>
                    {h.pledged ? <LockIcon className="size-3.5 text-muted-foreground" aria-label="Pledged" /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
