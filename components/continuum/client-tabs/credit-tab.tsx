import { lauCredit } from '@/lib/data'
import { MetricCard } from '../metric-card'
import { LtvThresholdBar } from '../ltv-threshold-bar'
import { SourceCitation, SystemLabel } from '../source-citation'
import { LtvProgression } from '../ltv-progression'

export function CreditTab() {
  const c = lauCredit
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard {...c.facility} />
        <MetricCard {...c.outstanding} />
        <MetricCard {...c.collateral} />
        <MetricCard {...c.ltv} tone="critical" />
        <MetricCard {...c.headroom} tone="critical" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              LTV progression · Mar – Sep 2026
            </h3>
            <SystemLabel />
          </div>
          <LtvProgression data={c.ltvHistory} warning={65} liquidation={70} />
          <LtvThresholdBar current={69.41} warning={65} liquidation={70} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            LTV has risen 8.2 pp since March, driven by a 7.9% decline in pledged Hong Kong property equities
            and an HKD 6.0m drawdown in June. The warning threshold was crossed on 12 Jun 2026.
          </p>
        </section>

        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Thresholds</h3>
            <dl className="flex flex-col divide-y text-sm">
              {[c.warning, c.liquidation].map((t) => (
                <div key={t.label} className="flex items-center justify-between py-2">
                  <dt className="text-muted-foreground">{t.label}</dt>
                  <dd className="tabular font-medium">{t.value}</dd>
                </div>
              ))}
            </dl>
            <SourceCitation source="Credit Facility" asOf="Facility LF-4471" />
          </section>

          <section className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Liquidity position
            </h3>
            <dl className="flex flex-col divide-y text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">{c.liquid.label}</dt>
                <dd className="tabular font-medium">{c.liquid.value}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">{c.obligations.label}</dt>
                <dd className="tabular font-medium">{c.obligations.value}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="font-medium">Shortfall</dt>
                <dd className="tabular font-semibold text-signal-critical">HKD 16.0m</dd>
              </div>
            </dl>
            <div className="flex gap-3">
              <SourceCitation source="Holdings" compact />
              <SourceCitation source="CRM" compact />
            </div>
          </section>
        </div>
      </div>

      <section className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Collateral composition
          </h3>
          <SourceCitation source="Credit Facility" asOf="05 Sep 2026" />
        </div>
        <ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {c.collateralComposition.map((row) => (
            <li key={row.label} className="flex flex-col gap-1 px-5 py-4 sm:border-r last:border-r-0">
              <p className="text-xs text-muted-foreground">{row.label}</p>
              <p className="tabular text-base font-medium">{row.value}</p>
              <p className="text-[11px] text-muted-foreground">Lending value {row.lendingValue}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
