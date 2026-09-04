import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { clients } from '@/lib/data'
import { PageHeader } from '@/components/continuum/page-header'
import { PriorityBadge } from '@/components/continuum/priority-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ClientsPage() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 lg:px-8">
      <PageHeader
        eyebrow="Book of clients"
        title="Clients"
        subtitle={`${clients.length} relationships under management`}
      />

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Domicile</TableHead>
              <TableHead>Mandate</TableHead>
              <TableHead className="text-right">Relationship value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last contact</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link href={`/clients/${c.id}`} className="font-medium hover:underline underline-offset-4">
                    {c.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.domicile}</TableCell>
                <TableCell className="text-muted-foreground">{c.mandate}</TableCell>
                <TableCell className="tabular text-right font-medium">{c.value}</TableCell>
                <TableCell>
                  <PriorityBadge priority={c.priority} size="sm" />
                </TableCell>
                <TableCell className="text-muted-foreground">{c.lastContact}</TableCell>
                <TableCell>
                  <Link
                    href={`/clients/${c.id}`}
                    aria-label={`Open ${c.name}`}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
