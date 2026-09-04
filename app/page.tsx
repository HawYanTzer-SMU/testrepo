import { PriorityClientCard } from '@/components/continuum/priority-client-card'
import { MeetingList, FollowUpList } from '@/components/continuum/today-panel'
import { PageHeader } from '@/components/continuum/page-header'
import { cn } from '@/lib/utils'
import type { PriorityClient } from '@/lib/data'
import { toAdviceStatus, formatDate } from '@/lib/recommendation-display'
import { getCockpitClients } from '@/services/cockpit'
import { listRecommendations } from '@/services/recommendations'

export const dynamic = 'force-dynamic'

export default async function MorningCockpitPage() {
  let cockpitClients: Awaited<ReturnType<typeof getCockpitClients>> = []
  let recommendations: Awaited<ReturnType<typeof listRecommendations>> = []
  let loadError: string | null = null

  try {
    ;[cockpitClients, recommendations] = await Promise.all([getCockpitClients(), listRecommendations()])
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load the Morning Cockpit.'
  }

  if (loadError) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-6 lg:px-8">
        <PageHeader title="Morning Cockpit" />
        <div className="rounded-md border border-signal-critical/30 bg-signal-critical-muted px-4 py-3 text-sm text-signal-critical">
          Could not load cockpit data: {loadError}
        </div>
      </div>
    )
  }

  const priorityClients: PriorityClient[] = cockpitClients.map((c) => ({
    id: c.client.client_id,
    name: c.client.client_name,
    priority: c.priority,
    reason: c.reason,
    evidence: c.evidence,
    exposure: { label: c.exposureLabel, value: c.exposureValue },
    previousAdvice: c.previousAdvice
      ? { status: toAdviceStatus(c.previousAdvice.status), date: c.previousAdvice.date, summary: c.previousAdvice.summary }
      : undefined,
    nextAction: c.nextAction,
    domicile: c.client.country_of_residence ?? c.client.tax_domicile ?? '—',
  }))

  const counts = {
    'ACTION REQUIRED': cockpitClients.filter((c) => c.priority === 'ACTION REQUIRED').length,
    'RM CHECK-IN': cockpitClients.filter((c) => c.priority === 'RM CHECK-IN').length,
    'FOLLOW-UP': cockpitClients.filter((c) => c.priority === 'FOLLOW-UP').length,
    REVIEW: cockpitClients.filter((c) => c.priority === 'REVIEW').length,
  }

  const summary = [
    { label: 'Action Required', value: counts['ACTION REQUIRED'], tone: 'critical' as const },
    { label: 'RM Check-in', value: counts['RM CHECK-IN'], tone: 'warning' as const },
    { label: 'Follow-ups', value: counts['FOLLOW-UP'], tone: 'default' as const },
    { label: 'For Review', value: counts.REVIEW, tone: 'default' as const },
  ]

  const followUps = recommendations
    .filter((r) => r.status === 'DEFERRED')
    .slice(0, 6)
    .map((r) => ({
      client: r.client_name,
      note: 'Deferred advice',
      detail: `“${r.title}” · deferred ${formatDate(r.updated_at)}`,
      due: 'Revisit',
    }))

  const timeSensitive = cockpitClients.filter((c) => c.priority === 'ACTION REQUIRED').length
  const rmName = cockpitClients[0]?.client.rm_name?.split(' ')[0] ?? 'there'

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        eyebrow="Morning Cockpit · Saturday, 5 September 2026"
        title={`Good morning, ${rmName}`}
        subtitle={
          cockpitClients.length
            ? `${cockpitClients.length} client${cockpitClients.length === 1 ? '' : 's'} require attention today. ${timeSensitive} ${timeSensitive === 1 ? 'is' : 'are'} time-sensitive.`
            : 'No clients currently require attention.'
        }
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
              Ranked by deterministic risk signals, obligations and deferred advice
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {priorityClients.length ? (
              priorityClients.map((client, i) => <PriorityClientCard key={client.id} client={client} rank={i + 1} />)
            ) : (
              <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                No open signals right now — every client is within mandate, credit and liquidity tolerances.
              </p>
            )}
          </div>
        </section>

        <aside aria-label="Today" className="flex flex-col gap-5 xl:sticky xl:top-20 xl:self-start">
          <h2 className="font-serif text-xl font-medium tracking-tight">Today</h2>
          <MeetingList meetings={[]} />
          <FollowUpList followUps={followUps} />
        </aside>
      </div>
    </div>
  )
}
