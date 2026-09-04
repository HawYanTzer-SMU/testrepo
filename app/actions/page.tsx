'use client'

import * as React from 'react'
import { actionQueue, type ActionItem, type ActionStatus } from '@/lib/data'
import { PageHeader } from '@/components/continuum/page-header'
import { ActionQueueCard } from '@/components/continuum/action-queue-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const tabs: { value: string; label: string; statuses: ActionStatus[] }[] = [
  { value: 'awaiting', label: 'Awaiting Review', statuses: ['Awaiting Review'] },
  { value: 'approved', label: 'Approved', statuses: ['Approved'] },
  { value: 'deferred', label: 'Deferred', statuses: ['Deferred'] },
  { value: 'completed', label: 'Completed', statuses: ['Completed', 'Rejected'] },
]

export default function ActionQueuePage() {
  const [items, setItems] = React.useState<ActionItem[]>(actionQueue)

  function handleDecision(id: string, decision: 'Approved' | 'Deferred' | 'Rejected') {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: decision } : a)))
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        title="Action Queue"
        subtitle="Review and approve proposed client actions before anything is sent or executed."
      />

      <Tabs defaultValue="awaiting">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              <span className="tabular ml-1 text-muted-foreground">
                {items.filter((i) => t.statuses.includes(i.status)).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const filtered = items.filter((i) => t.statuses.includes(i.status))
          return (
            <TabsContent key={t.value} value={t.value} className="flex flex-col gap-3 pt-5">
              {filtered.length ? (
                filtered.map((a) => <ActionQueueCard key={a.id} action={a} onDecision={handleDecision} />)
              ) : (
                <p className="rounded-md border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                  No actions in this state.
                </p>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
