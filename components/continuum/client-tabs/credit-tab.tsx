import { MetricCard } from '../metric-card'
import { LtvThresholdBar } from '../ltv-threshold-bar'
import { SourceCitation, SystemLabel } from '../source-citation'
import { LtvProgression } from '../ltv-progression'
import { formatMoney, formatPct } from '@/lib/format'
import type { CreditFacilityWithSnapshots } from '@/services/credit'
import type { HoldingWithInstrument } from '@/lib/supabase/types'

export function CreditTab({
  facilities,
  holdings,
}: {
  facilities: CreditFacilityWithSnapshots[]
  holdings: HoldingWithInstrument[]
}) {
  if (facilities.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No credit facility on record for this client.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {facilities.map((facility) => (
        <FacilityCard key={facility.facility_id} facility={facility} holdings={holdings} />
      ))}
    </div>
  )
}

function FacilityCard({ facility, holdings }: { facility: CreditFacilityWithSnapshots; holdings: HoldingWithInstrument[] }) {
  const latest = facility.latest
  const headroom = latest?.ltv_pct != null && facility.margin_call_ltv_pct != null ? facility.margin_call_ltv_pct - latest.ltv_pct : null

  const collateralHoldings = holdings.filter((h) => h.portfolio_id === facility.collateral_portfolio_id)
  const compositionMap = new Map<string, { valueUsd: number; lendingValue: number }>()
  for (const h of collateralHoldings) {
    const key = h.instrument.sub_asset_class ?? h.instrument.asset_class ?? 'Other'
    const entry = compositionMap.get(key) ?? { valueUsd: 0, lendingValue: 0 }
    entry.valueUsd += h.market_value_usd
    entry.lendingValue += h.lending_value_base ?? 0
    compositionMap.set(key, entry)
  }
  const composition = [...compositionMap.entries()].sort((a, b) => b[1].valueUsd - a[1].valueUsd)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{facility.facility_type ?? 'Credit facility'}</h3>
        <SourceCitation source="Credit Facility" asOf={`Facility ${facility.facility_id}`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Facility size" value={formatMoney(facility.credit_limit, facility.facility_ccy)} />
        <MetricCard label="Drawn" value={formatMoney(latest?.drawn ?? null, facility.facility_ccy)} />
        <MetricCard label="Collateral value" value={formatMoney(latest?.collateral_market_value ?? null, facility.facility_ccy)} />
        <MetricCard label="Current LTV" value={formatPct(latest?.ltv_pct)} tone="critical" />
        <MetricCard
          label="Headroom"
          value={headroom != null ? `${headroom.toFixed(2)} pp` : '—'}
          tone={headroom != null && headroom < 3 ? 'critical' : 'default'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              LTV progression
            </h4>
            <SystemLabel />
          </div>
          {facility.snapshots.length >= 2 ? (
            <LtvProgression
              data={facility.snapshots.map((s) => ({
                date: new Date(s.snapshot_date).toLocaleDateString('en-GB', { month: 'short' }),
                ltv: s.ltv_pct ?? 0,
              }))}
              warning={(facility.margin_call_ltv_pct ?? 0) - 5}
              liquidation={facility.margin_call_ltv_pct ?? 0}
              min={Math.min(...facility.snapshots.map((s) => s.ltv_pct ?? 0)) - 5}
              max={Math.max(facility.margin_call_ltv_pct ?? 0, ...facility.snapshots.map((s) => s.ltv_pct ?? 0)) + 5}
            />
          ) : null}
          {latest?.ltv_pct != null && facility.margin_call_ltv_pct != null ? (
            <LtvThresholdBar
              current={latest.ltv_pct}
              warning={facility.margin_call_ltv_pct - 5}
              liquidation={facility.margin_call_ltv_pct}
              min={Math.min(latest.ltv_pct, facility.margin_call_ltv_pct) - 15}
              max={facility.margin_call_ltv_pct + 10}
            />
          ) : null}
        </section>

        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Thresholds</h4>
            <dl className="flex flex-col divide-y text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">Margin call LTV</dt>
                <dd className="tabular font-medium">{formatPct(facility.margin_call_ltv_pct)}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">Interest rate</dt>
                <dd className="tabular font-medium">{formatPct(facility.interest_rate_pct)}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">Utilisation</dt>
                <dd className="tabular font-medium">{formatPct(facility.utilisation_pct_current)}</dd>
              </div>
            </dl>
            <SourceCitation source="Credit Facility" asOf={`Facility ${facility.facility_id}`} />
          </section>
        </div>
      </div>

      <section className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Collateral composition
          </h4>
          <SourceCitation source="Holdings" compact />
        </div>
        {composition.length ? (
          <ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {composition.map(([label, v]) => (
              <li key={label} className="flex flex-col gap-1 px-5 py-4 sm:border-r last:border-r-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="tabular text-base font-medium">{formatMoney(v.valueUsd)}</p>
                <p className="text-[11px] text-muted-foreground">Lending value {formatMoney(v.lendingValue)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-center text-sm text-muted-foreground">No collateral holdings found.</p>
        )}
      </section>
    </div>
  )
}
