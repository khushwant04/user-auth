import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { InvoiceFilters } from "@/components/invoice-filters"

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch user's billing account
  const billingAccount = await prisma.billingAccount.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!billingAccount) {
    redirect("/billing/setup")
  }

  // Fetch all invoices for the user
  const invoices = await prisma.invoice.findMany({
    where: {
      billingAccountId: billingAccount.id,
    },
    orderBy: {
      issuedDate: "desc",
    },
  })

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage and view your invoices</p>
        </div>
        <Button asChild>
          <Link href="/billing/invoices/new">
            <Icons.plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>View and manage all your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input placeholder="Search invoices..." />
                  <Button variant="outline" size="sm">
                    <Icons.search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
                <InvoiceFilters />
              </div>

              {invoices.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <Icons.fileText className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No invoices yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Create your first invoice to get started.</p>
                  <Button asChild className="mt-4">
                    <Link href="/billing/invoices/new">Create Invoice</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                    <div className="col-span-3">Invoice Number</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Issue Date</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-1"></div>
                  </div>
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                      <div className="col-span-3 font-medium">{invoice.invoiceNumber}</div>
                      <div className="col-span-2">${Number(invoice.amount).toFixed(2)}</div>
                      <div className="col-span-2">
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : invoice.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {invoice.status || "pending"}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {new Date(invoice.issuedDate).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="col-span-1 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/billing/invoices/${invoice.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

