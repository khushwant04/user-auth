import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch the invoice
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: params.id,
    },
    include: {
      billingAccount: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      transactions: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  // Check if the invoice belongs to the user
  if (invoice.billingAccount.userId !== session.user.id) {
    redirect("/billing/invoices")
  }

  // Mock invoice items - in a real app, these would be stored in the database
  const invoiceItems = [
    {
      id: "1",
      description: "Professional Services",
      quantity: 10,
      unitPrice: 150,
      amount: 1500,
    },
    {
      id: "2",
      description: "Software License",
      quantity: 1,
      unitPrice: 500,
      amount: 500,
    },
    {
      id: "3",
      description: "Support Hours",
      quantity: 5,
      unitPrice: 100,
      amount: 500,
    },
  ]

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = 0.1 // 10%
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <main className="container mx-auto max-w-4xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">{new Date(invoice.issuedDate).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/billing/invoices">
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/billing/invoices/${params.id}/pay`}>
              <Icons.dollarSign className="mr-2 h-4 w-4" />
              Pay Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Details of invoice #{invoice.invoiceNumber}</CardDescription>
            </div>
            <Badge
              variant={
                invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"
              }
            >
              {invoice.status || "pending"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <div className="mt-1">
                  <p className="font-medium">Your Company Name</p>
                  <p className="text-sm text-muted-foreground">123 Business Street</p>
                  <p className="text-sm text-muted-foreground">City, State 12345</p>
                  <p className="text-sm text-muted-foreground">contact@yourcompany.com</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                <div className="mt-1">
                  <p className="font-medium">{invoice.billingAccount.user.name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.billingAccount.user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.billingAccount.billingAddress || "No billing address"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                <p>{new Date(invoice.issuedDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}</p>
              </div>
              {invoice.paidDate && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Paid Date</p>
                  <p>{new Date(invoice.paidDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 font-medium">Invoice Items</h3>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Quantity</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {invoiceItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">${item.unitPrice.toFixed(2)}</div>
                    <div className="col-span-2 text-right">${item.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Tax (10%)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href={`/billing/invoices/${params.id}/download`}>
                <Icons.fileText className="mr-2 h-4 w-4" />
                Download PDF
              </Link>
            </Button>
            {invoice.status !== "paid" && (
              <Button asChild>
                <Link href={`/billing/invoices/${params.id}/pay`}>
                  <Icons.dollarSign className="mr-2 h-4 w-4" />
                  Pay Now
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {invoice.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Transaction history for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-3">Transaction Date</div>
                  <div className="col-span-3">Amount</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Type</div>
                </div>
                {invoice.transactions.map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                    <div className="col-span-3">{new Date(transaction.transactionDate).toLocaleDateString()}</div>
                    <div className="col-span-3">${Number(transaction.amount).toFixed(2)}</div>
                    <div className="col-span-3">
                      <Badge
                        variant={
                          transaction.status === "success"
                            ? "default"
                            : transaction.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {transaction.status || "pending"}
                      </Badge>
                    </div>
                    <div className="col-span-3">{transaction.transactionType || "payment"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

