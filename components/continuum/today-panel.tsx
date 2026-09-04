import { CalendarClockIcon, RepeatIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { meetings, followUps } from '@/lib/data'
import { SourceCitation } from './source-citation'

export function MeetingList() {
  return (
    <section aria-labelledby="meetings-heading" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 id="meetings-heading" className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <CalendarClockIcon className="size-3.5 text-muted-foreground" />
          Meetings
        </h3>
        <SourceCitation source="Calendar" compact />
      </div>
      <ol className="flex flex-col divide-y rounded-md border bg-card">
        {meetings.map((m) => (
          <li key={m.time} className="grid grid-cols-[44px_1fr] gap-3 px-3 py-2.5">
            <time className="tabular pt-px text-xs font-medium text-muted-foreground">{m.time}</time>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{m.client}</p>
              <p className="truncate text-xs text-muted-foreground">
                {m.topic} · {m.location}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function FollowUpList() {
  return (
    <section aria-labelledby="followups-heading" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 id="followups-heading" className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <RepeatIcon className="size-3.5 text-muted-foreground" />
          Follow-ups
        </h3>
        <SourceCitation source="Advice Ledger" compact />
      </div>
      <ul className="flex flex-col divide-y rounded-md border bg-card">
        {followUps.map((f) => (
          <li key={f.client} className="flex flex-col gap-1 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{f.client}</p>
              <span
                className={cn(
                  'shrink-0 text-[10px] font-semibold tracking-wide uppercase',
                  f.due === 'Overdue' ? 'text-signal-critical' : 'text-muted-foreground',
                )}
              >
                {f.due}
              </span>
            </div>
            <p className="text-xs font-medium text-foreground/90">{f.note}</p>
            <p className="text-xs text-muted-foreground">{f.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
