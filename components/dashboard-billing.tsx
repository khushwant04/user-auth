import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface BillingAccount {
  id: string
  accountNumber: string
  billingAddress: string | null
  paymentMethod: string | null
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string | null
  dueDate: Date | null
  issuedDate: Date
}

interface DashboardBillingProps {
  billingAccount: BillingAccount | null
  invoices: Invoice[]
}

export function DashboardBilling({ billingAccount, invoices }: DashboardBillingProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>Your recent invoices and billing status</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/billing">
            <Icons.creditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!billingAccount ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <Icons.creditCard className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No billing account</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up your billing account to manage invoices and payments.
            </p>
            <Button asChild className="mt-4">
              <Link href="/billing/setup">Set Up Billing</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Account #{billingAccount.accountNumber}</h4>
                <Badge variant="outline">{billingAccount.paymentMethod || "No payment method"}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {billingAccount.billingAddress || "No billing address"}
              </p>
            </div>

            <h4 className="font-semibold">Recent Invoices</h4>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">#{invoice.invoiceNumber}</p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "success"
                              : invoice.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {invoice.status || "pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Issued on {new Date(invoice.issuedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/billing/invoices/${invoice.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

