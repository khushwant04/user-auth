"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CancelSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [feedback, setFeedback] = useState("")

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would typically call an API endpoint to cancel the subscription
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Subscription cancelled successfully")
      router.push("/billing")
    } catch (error) {
      toast.error("Failed to cancel subscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Cancel Subscription</CardTitle>
          <CardDescription>We're sorry to see you go. Please let us know why you're cancelling.</CardDescription>
        </CardHeader>
        <form onSubmit={handleCancel}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Reason for cancellation</Label>
              <RadioGroup value={reason} onValueChange={setReason} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="too_expensive" id="too_expensive" />
                  <Label htmlFor="too_expensive">Too expensive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_using" id="not_using" />
                  <Label htmlFor="not_using">Not using the service enough</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="missing_features" id="missing_features" />
                  <Label htmlFor="missing_features">Missing features I need</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="switching" id="switching" />
                  <Label htmlFor="switching">Switching to another service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Additional feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us more about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-medium">What happens when you cancel:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Your subscription will remain active until the end of your current billing period.</li>
                <li>You will not be charged again after the current period ends.</li>
                <li>You can reactivate your subscription at any time before the end of the period.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading || !reason}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

