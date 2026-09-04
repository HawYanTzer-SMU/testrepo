import { SourceCitation } from '../source-citation'
import { formatMoney } from '@/lib/format'
import type { Commitment, PlannedCashNeed } from '@/lib/supabase/types'

// The official dataset has no family-tree / estate-planning fields at all —
// the previous version of this tab fabricated a spouse, children and estate
// status. Rather than wire fake data to a real backend, this tab now shows
// what the dataset actually supports for "life & liquidity planning":
// planned_cash_needs (many of which are family-driven — school fees,
// inheritance tax, elderly-parent support) and private-market commitments.
export function FamilyTab({
  plannedCashNeeds,
  commitments,
}: {
  plannedCashNeeds: PlannedCashNeed[]
  commitments: Commitment[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="cash-needs-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 id="cash-needs-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Planned cash needs
          </h3>
          <SourceCitation source="CRM" compact />
        </div>
        {plannedCashNeeds.length ? (
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {plannedCashNeeds.map((n) => (
              <li key={n.need_id} className="flex flex-col gap-1.5 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-pretty">{n.description}</p>
                  <span className="tabular shrink-0 text-sm font-medium">{formatMoney(n.amount, n.currency)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {n.due_from} – {n.due_to}
                  </span>
                  <span>·</span>
                  <span>{n.recurrence}</span>
                  <span>·</span>
                  <span>{n.certainty}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
            No planned cash needs recorded.
          </p>
        )}
      </section>

      <section aria-labelledby="commitments-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 id="commitments-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Private-market commitments
          </h3>
          <SourceCitation source="Holdings" compact />
        </div>
        {commitments.length ? (
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {commitments.map((c) => (
              <li key={c.commitment_id} className="flex flex-col gap-1.5 px-4 py-3">
                <p className="text-sm font-medium">{c.fund_name}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Committed</p>
                    <p className="tabular font-medium">{formatMoney(c.committed, c.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Called</p>
                    <p className="tabular font-medium">{formatMoney(c.called_to_date, c.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uncalled</p>
                    <p className="tabular font-medium">{formatMoney(c.uncalled, c.currency)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Expected call window: {c.expected_call_window}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
            No private-market commitments recorded.
          </p>
        )}
      </section>
    </div>
  )
}
