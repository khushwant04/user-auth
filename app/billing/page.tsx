import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BillingOverview } from "@/components/billing-overview"
import { InvoiceList } from "@/components/invoice-list"
import { SubscriptionDetails } from "@/components/subscription-details"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch user's billing account
  const billingAccount = await prisma.billingAccount.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      subscriptions: {
        orderBy: {
          startDate: "desc",
        },
        take: 1,
      },
      invoices: {
        orderBy: {
          issuedDate: "desc",
        },
        take: 5,
      },
    },
  })

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your billing information, subscriptions, and invoices</p>
        </div>
        {billingAccount ? (
          <Button asChild>
            <Link href="/billing/invoices/new">
              <Icons.fileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/billing/setup">
              <Icons.creditCard className="mr-2 h-4 w-4" />
              Set Up Billing
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {billingAccount ? (
            <>
              <BillingOverview billingAccount={billingAccount} />
              <div className="mt-8">
                <InvoiceList invoices={billingAccount.invoices} />
              </div>
            </>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Icons.creditCard className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No billing account</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set up your billing account to manage invoices and payments.
              </p>
              <Button asChild className="mt-4">
                <Link href="/billing/setup">Set Up Billing</Link>
              </Button>
            </div>
          )}
        </div>
        <div>
          {billingAccount?.subscriptions.length ? (
            <SubscriptionDetails subscription={billingAccount.subscriptions[0]} />
          ) : (
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Subscription</h3>
              <p className="mt-2 text-sm text-muted-foreground">You don't have an active subscription.</p>
              <Button asChild className="mt-4 w-full">
                <Link href="/billing/subscription/new">
                  <Icons.plus className="mr-2 h-4 w-4" />
                  Subscribe to a Plan
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

