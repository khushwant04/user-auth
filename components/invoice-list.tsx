import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string | null
  dueDate: Date | null
  issuedDate: Date
  paidDate: Date | null
}

interface InvoiceListProps {
  invoices: Invoice[]
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your recent invoices and payment history</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/billing/invoices/new">
            <Icons.plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <Icons.fileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No invoices yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first invoice to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">Invoice #{invoice.invoiceNumber}</h4>
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
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <p>Issued: {new Date(invoice.issuedDate).toLocaleDateString()}</p>
                    {invoice.dueDate && <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>}
                    {invoice.paidDate && <p>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/billing/invoices/${invoice.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/billing/invoices">View All Invoices</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

