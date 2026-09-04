import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRightIcon, HistoryIcon } from 'lucide-react'
import { clients, priorityFeed, adviceLedger, actionQueue, lauProfile } from '@/lib/data'
import { ClientHeader } from '@/components/continuum/client-header'
import { InsightPanel } from '@/components/continuum/insight-panel'
import { RecommendationPanel } from '@/components/continuum/recommendation-panel'
import { PriorityBadge } from '@/components/continuum/priority-badge'
import { EvidenceChip } from '@/components/continuum/evidence-chip'
import { AdviceStatusBadge } from '@/components/continuum/advice-status-badge'
import { SourceCitation } from '@/components/continuum/source-citation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { OverviewTab } from '@/components/continuum/client-tabs/overview-tab'
import { PortfolioTab } from '@/components/continuum/client-tabs/portfolio-tab'
import { CreditTab } from '@/components/continuum/client-tabs/credit-tab'
import { BehaviourTab } from '@/components/continuum/client-tabs/behaviour-tab'
import { FamilyTab } from '@/components/continuum/client-tabs/family-tab'
import { AdviceHistoryTab } from '@/components/continuum/client-tabs/advice-history-tab'

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = clients.find((c) => c.id === id)
  if (!client) notFound()

  if (id === 'lau-chi-ming') {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
        <ClientHeader
          name={lauProfile.name}
          domicile={lauProfile.domicile}
          mandate={lauProfile.mandate}
          since={lauProfile.since}
          relationshipValue={lauProfile.relationshipValue}
          segment={lauProfile.segment}
          lastContact={lauProfile.lastContact}
          priority={lauProfile.priority}
        />

        <InsightPanel />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="credit">Credit & Liquidity</TabsTrigger>
            <TabsTrigger value="behaviour">Behaviour</TabsTrigger>
            <TabsTrigger value="family">Family & Life</TabsTrigger>
            <TabsTrigger value="advice">Advice History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-5">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="portfolio" className="pt-5">
            <PortfolioTab />
          </TabsContent>
          <TabsContent value="credit" className="pt-5">
            <CreditTab />
          </TabsContent>
          <TabsContent value="behaviour" className="pt-5">
            <BehaviourTab />
          </TabsContent>
          <TabsContent value="family" className="pt-5">
            <FamilyTab />
          </TabsContent>
          <TabsContent value="advice" className="pt-5">
            <AdviceHistoryTab />
          </TabsContent>
        </Tabs>

        <RecommendationPanel />
      </div>
    )
  }

  const priority = priorityFeed.find((p) => p.id === id)
  const ledgerRows = adviceLedger.filter((l) => l.clientId === id)
  const actions = actionQueue.filter((a) => a.clientId === id)

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <ClientHeader
        name={client.name}
        domicile={client.domicile}
        mandate={client.mandate}
        relationshipValue={client.value}
        segment={client.mandate}
        lastContact={client.lastContact}
        priority={client.priority}
      />

      {priority ? (
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              What you need to know
            </h2>
            <PriorityBadge priority={priority.priority} size="sm" />
          </div>
          <p className="max-w-3xl font-serif text-lg leading-snug text-pretty">{priority.reason}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {priority.evidence.map((e) => (
              <EvidenceChip key={e.label} evidence={e} />
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-3 text-sm">
            <span>
              <span className="text-[11px] tracking-wide text-muted-foreground uppercase">Recommended next action</span>{' '}
              <span className="font-medium">{priority.nextAction}</span>
            </span>
            <Link
              href="/actions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Review in Action Queue
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          No open priority signals for this client. A full evidence workbench — portfolio, credit, behaviour and
          family context — is available today for Lau Chi Ming; other clients will be enabled as sources are
          connected.
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="advice-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="advice-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Related advice
            </h2>
            <SourceCitation source="Advice Ledger" compact />
          </div>
          {ledgerRows.length ? (
            <ul className="flex flex-col divide-y rounded-md border bg-card">
              {ledgerRows.map((row) => (
                <li key={row.id} className="flex flex-col gap-1.5 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-pretty">{row.recommendation}</p>
                    <AdviceStatusBadge status={row.status} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.category} · Raised {row.created}
                    {row.status === 'Resurfaced' ? (
                      <span className="flex items-center gap-1 pt-1 text-signal-critical">
                        <HistoryIcon className="size-3" /> {row.lastAction}
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
              No recommendations recorded yet.
            </p>
          )}
        </section>

        <section aria-labelledby="actions-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="actions-heading" className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Related actions
            </h2>
            <SourceCitation source="Advice Ledger" compact />
          </div>
          {actions.length ? (
            <ul className="flex flex-col divide-y rounded-md border bg-card">
              {actions.map((a) => (
                <li key={a.id} className="flex flex-col gap-1 px-4 py-3">
                  <p className="text-sm font-medium">{a.workflow}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.type} · {a.status} · {a.created}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
              No actions in the queue for this client.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
