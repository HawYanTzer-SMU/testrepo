import { AdviceTimeline, type RecommendationWithEvents } from '../advice-timeline'
import { SourceCitation } from '../source-citation'

export function AdviceHistoryTab({ items }: { items: RecommendationWithEvents[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Advice timeline
        </h3>
        <SourceCitation source="Advice Ledger" compact />
      </div>
      {items.length ? (
        <AdviceTimeline items={items} />
      ) : (
        <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          No recommendations recorded for this client yet.
        </p>
      )}
    </div>
  )
}
