import { cn } from '@/lib/utils'
import type { AdviceEntry } from '@/lib/data'
import { AdviceStatusBadge } from './advice-status-badge'
import { SourceCitation } from './source-citation'

export function AdviceTimeline({ entries }: { entries: AdviceEntry[] }) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry, i) => (
        <li key={entry.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-card',
                entry.current ? 'bg-primary ring-2 ring-primary/25' : 'bg-muted-foreground/40',
              )}
            />
            {i < entries.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
          </div>

          <div className={cn('flex flex-1 flex-col gap-3 pb-8', i === entries.length - 1 && 'pb-0')}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <time className="tabular text-xs font-medium text-muted-foreground">{entry.date}</time>
                <AdviceStatusBadge status={entry.status} size="sm" />
              </div>
            </div>

            <div
              className={cn(
                'flex flex-col gap-3 rounded-lg border bg-card p-4',
                entry.current && 'border-primary/30',
              )}
            >
              <div className="flex flex-col gap-1">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {entry.current ? 'Current recommendation' : 'Recommendation'}
                </p>
                <p className="text-sm font-medium text-pretty">{entry.recommendation}</p>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">Trigger — </span>
                {entry.trigger}
              </p>

              <div className="grid gap-3 border-t pt-3 sm:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Outcome</p>
                  <p className="text-xs text-foreground/90">{entry.outcome}</p>
                  {entry.clientReason ? (
                    <p className="text-xs text-muted-foreground italic">“{entry.clientReason}”</p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">RM comment</p>
                  <p className="text-xs text-foreground/90">{entry.rmComment}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Follow-up trigger — </span>
                  {entry.followUpTrigger}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {entry.evidence.map((ev) => (
                    <span key={ev.label} className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">{ev.label}</span>
                      <span className="tabular font-medium">{ev.value}</span>
                      <SourceCitation source={ev.source} compact />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
