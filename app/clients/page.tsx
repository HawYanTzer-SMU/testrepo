import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { getClients } from '@/services/clients'
import { PageHeader } from '@/components/continuum/page-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  let clients: Awaited<ReturnType<typeof getClients>> = []
  let loadError: string | null = null

  try {
    clients = await getClients()
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load clients.'
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        eyebrow="Book of clients"
        title="Clients"
        subtitle={loadError ? undefined : `${clients.length} relationships under management`}
      />

      {loadError ? (
        <div className="rounded-md border border-signal-critical/30 bg-signal-critical-muted px-4 py-3 text-sm text-signal-critical">
          Could not load clients: {loadError}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Domicile</TableHead>
                <TableHead>Mandate / risk profile</TableHead>
                <TableHead className="text-right">Relationship value</TableHead>
                <TableHead>Wealth band</TableHead>
                <TableHead>RM</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.client_id}>
                  <TableCell>
                    <Link href={`/clients/${c.client_id}`} className="font-medium hover:underline underline-offset-4">
                      {c.client_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.country_of_residence ?? c.tax_domicile ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{c.risk_profile ?? '—'}</TableCell>
                  <TableCell className="tabular text-right font-medium">{formatMoney(c.total_aum_usd, c.base_currency)}</TableCell>
                  <TableCell className="text-muted-foreground">{c.wealth_band ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{c.rm_name ?? '—'}</TableCell>
                  <TableCell>
                    <Link
                      href={`/clients/${c.client_id}`}
                      aria-label={`Open ${c.client_name}`}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!clients.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
