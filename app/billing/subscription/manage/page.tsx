"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import Link from "next/link"

interface Subscription {
  id: string
  planName: string
  startDate: string
  endDate: string | null
  status: string | null
}

export default function ManageSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState({
    planName: "",
    status: "",
    endDate: "",
  })

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/billing/subscriptions")

        if (!response.ok) {
          throw new Error("Failed to fetch subscription")
        }

        const data = await response.json()
        if (data.length > 0) {
          const currentSubscription = data[0]
          setSubscription(currentSubscription)
          setFormData({
            planName: currentSubscription.planName,
            status: currentSubscription.status || "active",
            endDate: currentSubscription.endDate
              ? new Date(currentSubscription.endDate).toISOString().split("T")[0]
              : "",
          })
        }
      } catch (error) {
        toast.error("Error loading subscription")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handlePlanChange = (value: string) => {
    setFormData((prev) => ({ ...prev, planName: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would typically call an API endpoint to update the subscription
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Subscription updated successfully")
      router.push("/billing")
    } catch (error) {
      toast.error("Failed to update subscription")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-3xl py-10">
        <div className="flex items-center justify-center h-[400px]">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </main>
    )
  }

  if (!subscription) {
    return (
      <main className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>You don't have an active subscription to manage.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/billing/subscription/new">Create Subscription</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>Update your subscription details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="planName">Subscription Plan</Label>
              <Select value={formData.planName} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Plan</SelectItem>
                  <SelectItem value="Pro">Pro Plan</SelectItem>
                  <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Update Subscription
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

