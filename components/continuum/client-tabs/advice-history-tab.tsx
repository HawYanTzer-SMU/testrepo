import { lauAdviceHistory } from '@/lib/data'
import { AdviceTimeline } from '../advice-timeline'
import { SourceCitation } from '../source-citation'

export function AdviceHistoryTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Advice timeline
        </h3>
        <SourceCitation source="Advice Ledger" compact />
      </div>
      <AdviceTimeline entries={lauAdviceHistory} />
    </div>
  )
}
