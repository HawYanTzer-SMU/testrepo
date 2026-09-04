import { cn } from '@/lib/utils'
import { lauIssues, lauObjectives } from '@/lib/data'
import { KeystoneInsight } from '../keystone-insight'
import { SourceCitation } from '../source-citation'

export function OverviewTab() {
  return (
    <div className="flex flex-col gap-6">
      <KeystoneInsight />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="issues-heading" className="flex flex-col gap-3">
          <h3 id="issues-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Current issues
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {lauIssues.map((issue) => (
              <article
                key={issue.title}
                className={cn(
                  'flex flex-col gap-2 rounded-md border bg-card p-4',
                  issue.tone === 'critical' && 'border-signal-critical/25',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold">{issue.title}</h4>
                  <span
                    className={cn(
                      'tabular shrink-0 text-sm font-medium',
                      issue.tone === 'critical' ? 'text-signal-critical' : 'text-signal-warning-foreground',
                    )}
                  >
                    {issue.metric}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{issue.summary}</p>
                <SourceCitation source={issue.source} compact className="mt-auto" />
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="objectives-heading" className="flex flex-col gap-3">
          <h3 id="objectives-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Objectives
          </h3>
          <ol className="flex flex-col divide-y rounded-md border bg-card">
            {lauObjectives.map((o) => (
              <li key={o.title} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{o.title}</p>
                  <SourceCitation source={o.source} compact />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{o.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
