import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"

interface BillingAccount {
  id: string
  accountNumber: string
  billingAddress: string | null
  paymentMethod: string | null
  createdAt: Date
  updatedAt: Date
}

interface BillingOverviewProps {
  billingAccount: BillingAccount
}

export function BillingOverview({ billingAccount }: BillingOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing Account</CardTitle>
          <CardDescription>Your billing information and payment methods</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/billing/edit`}>
            <Icons.edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Account Number</h3>
              <p className="mt-1 font-medium">{billingAccount.accountNumber}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
              <p className="mt-1 font-medium">{billingAccount.paymentMethod || "Not set"}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Billing Address</h3>
            <p className="mt-1 font-medium">{billingAccount.billingAddress || "No billing address set"}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
              <p className="mt-1 font-medium">{new Date(billingAccount.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
              <p className="mt-1 font-medium">{new Date(billingAccount.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

