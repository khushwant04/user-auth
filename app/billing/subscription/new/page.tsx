"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

export default function NewSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential features for individuals",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: ["Up to 3 projects", "Basic reporting", "Email support"],
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for professionals",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: ["Unlimited projects", "Advanced reporting", "Priority email support", "Team collaboration"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Complete solution for businesses",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        "Unlimited everything",
        "Custom reporting",
        "24/7 phone support",
        "Advanced security",
        "Dedicated account manager",
      ],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan) {
      toast.error("Please select a plan")
      return
    }

    setIsLoading(true)

    try {
      const plan = plans.find((p) => p.id === selectedPlan)

      if (!plan) {
        throw new Error("Invalid plan selected")
      }

      const response = await fetch("/api/billing/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName: plan.name,
          startDate: new Date().toISOString(),
          status: "active",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      toast.success("Subscription created successfully")
      router.push("/billing")
    } catch (error) {
      toast.error("Failed to create subscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-5xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Choose a Subscription Plan</h1>
        <p className="text-muted-foreground">Select the plan that best fits your needs</p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-md border p-1">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly (Save 15%)
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${selectedPlan === plan.id ? "border-2 border-primary" : ""}`}
            >
              {selectedPlan === plan.id && (
                <div className="absolute right-2 top-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Icons.check className="h-4 w-4" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Icons.check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedPlan}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Subscribe Now
          </Button>
        </div>
      </form>
    </main>
  )
}

