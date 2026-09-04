import { priorityFeed } from '@/lib/data'
import { PriorityClientCard } from '@/components/continuum/priority-client-card'
import { MeetingList, FollowUpList } from '@/components/continuum/today-panel'
import { PageHeader } from '@/components/continuum/page-header'
import { cn } from '@/lib/utils'

const summary = [
  { label: 'Action Required', value: 2, tone: 'critical' },
  { label: 'RM Check-in', value: 3, tone: 'warning' },
  { label: 'Follow-ups Due', value: 4, tone: 'default' },
  { label: 'Meetings Today', value: 3, tone: 'default' },
] as const

export default function MorningCockpitPage() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        eyebrow="Morning Cockpit · Friday, 5 September 2026"
        title="Good morning, Sarah"
        subtitle="5 clients require attention today. 2 are time-sensitive."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {summary.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-md border bg-card px-4 py-3"
          >
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
            <span
              className={cn(
                'tabular text-xl font-medium tracking-tight',
                s.tone === 'critical' && 'text-signal-critical',
              )}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section aria-labelledby="feed-heading" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 id="feed-heading" className="text-sm font-semibold">
              Priority client feed
            </h2>
            <p className="text-xs text-muted-foreground">
              Ranked by deterministic risk signals, obligations and deferred advice · refreshed 06:00 HKT
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {priorityFeed.map((client, i) => (
              <PriorityClientCard key={client.id} client={client} rank={i + 1} />
            ))}
          </div>
        </section>

        <aside aria-label="Today" className="flex flex-col gap-5 xl:sticky xl:top-20 xl:self-start">
          <h2 className="font-serif text-xl font-medium tracking-tight">Today</h2>
          <MeetingList />
          <FollowUpList />
        </aside>
      </div>
    </div>
  )
}
