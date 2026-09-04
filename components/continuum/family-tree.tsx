import { lauFamily } from '@/lib/data'

export function FamilyTree() {
  const { principal, members } = lauFamily

  return (
    <div className="flex flex-col items-start gap-0">
      <div className="rounded-md border bg-card px-4 py-3">
        <p className="text-sm font-semibold">{principal.name}</p>
        <p className="text-xs text-muted-foreground">{principal.role}</p>
      </div>

      <div className="ml-6 flex flex-col">
        <div className="h-4 w-px bg-border" />
        {members.map((m, i) => (
          <div key={m.name} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-4 w-px bg-border" />
              <div className="h-px w-4 bg-border" />
              {i < members.length - 1 ? <div className="h-full w-px bg-border" /> : null}
            </div>
            <div className="mb-4 flex flex-col gap-1 rounded-md border bg-card px-4 py-2.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{m.name}</p>
                <span className="rounded-sm bg-secondary px-1.5 py-px text-[10px] font-medium tracking-wide text-secondary-foreground uppercase">
                  {m.relation}
                </span>
                <span className="tabular text-xs text-muted-foreground">Age {m.age}</span>
              </div>
              <p className="text-xs text-muted-foreground">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
