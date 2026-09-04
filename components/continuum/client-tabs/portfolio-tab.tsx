import { LockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SourceCitation } from '../source-citation'
import { MandateComparison } from '../mandate-comparison'
import { allocationByAssetClass, topHoldings, totalValueUsd } from '@/lib/portfolio-analytics'
import type { HoldingWithInstrument, MandateAllocation, Portfolio } from '@/lib/supabase/types'
import { formatMoney } from '@/lib/format'

export function PortfolioTab({
  portfolios,
  holdings,
  mandateAllocations,
  collateralPortfolioIds,
}: {
  portfolios: Portfolio[]
  holdings: HoldingWithInstrument[]
  mandateAllocations: MandateAllocation[]
  collateralPortfolioIds: Set<string>
}) {
  const primaryPortfolio = portfolios[0]
  const allocation = allocationByAssetClass(holdings)
  const rows = allocation.map((a) => {
    const rule = mandateAllocations.find((m) => m.asset_class === a.label)
    return {
      asset: a.label,
      pct: Number(a.pct.toFixed(1)),
      value: formatMoney(a.valueUsd),
      target: rule ? `${rule.min_pct}–${rule.max_pct}%` : '0–100%',
    }
  })
  const top = topHoldings(holdings, 8)

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <section aria-labelledby="alloc-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 id="alloc-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Allocation vs mandate
          </h3>
          <SourceCitation source="Holdings" compact />
        </div>
        <div className="rounded-md border bg-card p-4">
          <p className="mb-4 text-xs text-muted-foreground">
            Total holdings <span className="tabular font-medium text-foreground">{formatMoney(totalValueUsd(holdings))}</span>
            {primaryPortfolio?.mandate_code ? ` · ${primaryPortfolio.mandate_code} mandate` : ''}
          </p>
          {rows.length ? (
            <MandateComparison rows={rows} />
          ) : (
            <p className="text-sm text-muted-foreground">No holdings on record.</p>
          )}
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
              {top.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <p className="font-medium">{h.instrument.instrument_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{h.instrument_id}</p>
                  </TableCell>
                  <TableCell className="tabular text-right">{formatMoney(h.market_value_usd)}</TableCell>
                  <TableCell
                    className={cn(
                      'tabular text-right',
                      (h.unrealised_pnl_pct ?? 0) < 0 && 'text-signal-critical',
                      (h.unrealised_pnl_pct ?? 0) > 0 && 'text-signal-positive',
                    )}
                  >
                    {h.unrealised_pnl_pct != null ? `${h.unrealised_pnl_pct > 0 ? '+' : ''}${h.unrealised_pnl_pct.toFixed(1)}%` : '—'}
                  </TableCell>
                  <TableCell>
                    {collateralPortfolioIds.has(h.portfolio_id) ? (
                      <LockIcon className="size-3.5 text-muted-foreground" aria-label="Pledged" />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {!top.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    No holdings on record.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
