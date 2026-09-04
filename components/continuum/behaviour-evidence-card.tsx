import { cn } from '@/lib/utils'
import { SourceCitation, AssistLabel } from './source-citation'
import type { SourceSystem } from '@/lib/data'

export function BehaviourTag({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center rounded-sm border border-accent/40 bg-accent px-2 text-xs font-medium text-accent-foreground',
        className,
      )}
    >
      {label}
    </span>
  )
}

export function BehaviourEvidenceCard({
  observation,
}: {
  observation: {
    tag: string
    evidenceSource: SourceSystem
    evidenceDate: string
    quote: string
    guidance: string
  }
}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <BehaviourTag label={observation.tag} className="text-sm" />
        <SourceCitation source={observation.evidenceSource} asOf={observation.evidenceDate} />
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Evidence</h4>
        <blockquote className="border-l-2 border-border pl-3 text-sm leading-relaxed text-pretty text-foreground/90">
          “{observation.quote}”
        </blockquote>
      </div>

      <div className="flex flex-col gap-1.5 rounded-md bg-assist-muted p-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Communication guidance
          </h4>
          <AssistLabel>AI-drafted</AssistLabel>
        </div>
        <p className="text-sm leading-relaxed text-pretty text-foreground">{observation.guidance}</p>
      </div>
    </article>
  )
}
