import { cn } from '@/lib/utils'
import { KeystoneInsight } from '../keystone-insight'
import { SourceCitation } from '../source-citation'
import type { InsightWithEvidence } from '@/services/insights'

const SEVERITY_TONE: Record<InsightWithEvidence['severity'], 'critical' | 'warning' | 'default'> = {
  Critical: 'critical',
  High: 'critical',
  Medium: 'warning',
  Low: 'default',
}

export function OverviewTab({ insights, objectives }: { insights: InsightWithEvidence[]; objectives: string | null }) {
  const concentrationInsight = insights.find((i) => i.insight_type === 'CONCENTRATION_RISK') ?? null
  const objectiveList = objectives
    ? objectives.split(';').map((o) => o.trim()).filter(Boolean)
    : []

  return (
    <div className="flex flex-col gap-6">
      <KeystoneInsight insight={concentrationInsight} />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="issues-heading" className="flex flex-col gap-3">
          <h3 id="issues-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Current issues
          </h3>
          {insights.length ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {insights.slice(0, 3).map((issue) => {
                const tone = SEVERITY_TONE[issue.severity]
                return (
                  <article
                    key={issue.id}
                    className={cn(
                      'flex flex-col gap-2 rounded-md border bg-card p-4',
                      tone === 'critical' && 'border-signal-critical/25',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-pretty">{issue.title}</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{issue.summary}</p>
                    <span
                      className={cn(
                        'mt-auto w-fit rounded-sm px-1.5 py-px text-[10px] font-semibold tracking-wide uppercase',
                        tone === 'critical' && 'bg-signal-critical-muted text-signal-critical',
                        tone === 'warning' && 'bg-signal-warning-muted text-signal-warning-foreground',
                        tone === 'default' && 'bg-secondary text-secondary-foreground',
                      )}
                    >
                      {issue.severity}
                    </span>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
              No open issues for this client.
            </p>
          )}
        </section>

        <section aria-labelledby="objectives-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 id="objectives-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Objectives
            </h3>
            <SourceCitation source="CRM" compact />
          </div>
          {objectiveList.length ? (
            <ol className="flex flex-col divide-y rounded-md border bg-card">
              {objectiveList.map((o) => (
                <li key={o} className="px-4 py-3 text-sm text-pretty">
                  {o}
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
              No objectives recorded.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
