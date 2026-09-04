import { InfoIcon } from 'lucide-react'
import { lauBehaviour } from '@/lib/data'
import { BehaviourEvidenceCard } from '../behaviour-evidence-card'

export function BehaviourTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Observed client behaviour
        </h3>
        <p className="text-xs text-muted-foreground">Derived from RM notes and interaction records</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {lauBehaviour.map((b) => (
          <BehaviourEvidenceCard key={b.tag} observation={b} />
        ))}
      </div>

      <div className="flex items-start gap-2.5 rounded-md border bg-surface px-4 py-3 text-xs text-muted-foreground">
        <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
        <p>
          <span className="font-medium text-foreground">Behaviour changes communication strategy, not financial
          urgency.</span> Observed behaviour informs how a recommendation is framed. It never determines whether
          intervention is required — that is set solely by deterministic risk and mandate signals.
        </p>
      </div>
    </div>
  )
}
