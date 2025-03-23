import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Icons } from "@/components/icons"

interface Subscription {
  id: string
  planName: string
  startDate: Date
  endDate: Date | null
  status: string | null
}

interface SubscriptionDetailsProps {
  subscription: Subscription
}

export function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const isActive = subscription.status === "active"
  const daysRemaining = subscription.endDate
    ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Your current subscription plan and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{subscription.planName}</h3>
          <Badge variant={isActive ? "default" : "secondary"}>{subscription.status || "inactive"}</Badge>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Start Date</span>
            <span className="text-sm font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">End Date</span>
            <span className="text-sm font-medium">
              {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "No end date"}
            </span>
          </div>
          {subscription.endDate && isActive && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Days Remaining</span>
              <span className="text-sm font-medium">{daysRemaining} days</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button asChild className="w-full">
          <Link href="/billing/subscription/manage">
            <Icons.edit className="mr-2 h-4 w-4" />
            Manage Subscription
          </Link>
        </Button>
        {isActive && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/billing/subscription/cancel">Cancel Subscription</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

