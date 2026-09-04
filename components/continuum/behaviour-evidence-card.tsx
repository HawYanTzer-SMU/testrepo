import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SourceCitation, AiGeneratedLabel } from "@/components/continuum/source-citation"
import type { BehaviourObservation } from "@/lib/data"
import { cn } from "@/lib/utils"

export function BehaviourTag({ label, className }: { label: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-foreground", className)}
    >
      {label}
    </Badge>
  )
}

export function BehaviourEvidenceCard({ observation }: { observation: BehaviourObservation }) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <BehaviourTag label={observation.tag} className="w-fit text-sm" />
            <CardDescription className="text-xs">
              Observed pattern, derived from RM notes and interaction records.
            </CardDescription>
          </div>
          <SourceCitation source={observation.evidence.source} date={observation.evidence.date} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Evidence</CardTitle>
          <blockquote className="border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground">
            &ldquo;{observation.evidence.quote}&rdquo;
          </blockquote>
        </div>
        <div className="flex flex-col gap-1.5 rounded-md bg-ai-surface p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Communication guidance
            </span>
            <AiGeneratedLabel />
          </div>
          <p className="text-sm leading-relaxed text-foreground">{observation.guidance}</p>
        </div>
      </CardContent>
    </Card>
  )
}
