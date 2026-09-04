import { lauFamily } from '@/lib/data'
import { FamilyTree } from '../family-tree'
import { SourceCitation } from '../source-citation'

export function FamilyTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <section aria-labelledby="family-heading" className="flex flex-col gap-3">
        <h3 id="family-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Family
        </h3>
        <div className="rounded-md border bg-card p-5">
          <FamilyTree />
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <section aria-labelledby="business-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 id="business-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Family business obligations
            </h3>
          </div>
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {lauFamily.businessObligations.map((o) => (
              <li key={o.label} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="tabular text-sm font-medium">{o.value}</span>
                  <SourceCitation source={o.source} compact />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section aria-labelledby="estate-heading" className="flex flex-col gap-3">
            <h3 id="estate-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Estate planning
            </h3>
            <div className="flex flex-col gap-2 rounded-md border bg-card p-4">
              <span className="w-fit rounded-sm bg-signal-warning-muted px-1.5 py-px text-[10px] font-semibold tracking-wide text-signal-warning-foreground uppercase">
                {lauFamily.estatePlanning.status}
              </span>
              <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {lauFamily.estatePlanning.detail}
              </p>
              <SourceCitation source={lauFamily.estatePlanning.source} compact className="mt-auto" />
            </div>
          </section>

          <section aria-labelledby="events-heading" className="flex flex-col gap-3">
            <h3 id="events-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Upcoming life events
            </h3>
            <ul className="flex flex-col divide-y rounded-md border bg-card">
              {lauFamily.lifeEvents.map((e) => (
                <li key={e.label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span>{e.label}</span>
                  <span className="tabular shrink-0 text-xs text-muted-foreground">{e.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="liquidity-heading" className="flex flex-col gap-3">
          <h3 id="liquidity-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Upcoming liquidity needs
          </h3>
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {lauFamily.liquidityNeeds.map((n) => (
              <li key={n.label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span>{n.label}</span>
                <span className="flex items-center gap-3">
                  <span className="tabular font-medium">{n.value}</span>
                  <span className="text-xs text-muted-foreground">{n.when}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
