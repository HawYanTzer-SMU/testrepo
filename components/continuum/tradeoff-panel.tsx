import { ScaleIcon } from 'lucide-react'

export function TradeoffPanel({ tradeoffs }: { tradeoffs: { title: string; detail: string }[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-surface p-4">
      <h4 className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        <ScaleIcon className="size-3.5" />
        Trade-offs
      </h4>
      <ul className="flex flex-col divide-y">
        {tradeoffs.map((t) => (
          <li key={t.title} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
            <p className="text-sm font-medium">{t.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{t.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
