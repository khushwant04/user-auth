"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface BillingAccount {
  id: string
  accountNumber: string
  billingAddress: string | null
  paymentMethod: string | null
}

export default function EditBillingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    billingAddress: "",
    paymentMethod: "credit_card",
  })

  useEffect(() => {
    async function fetchBillingAccount() {
      try {
        const response = await fetch("/api/billing")

        if (!response.ok) {
          throw new Error("Failed to fetch billing account")
        }

        const data = await response.json()
        setFormData({
          billingAddress: data.billingAddress || "",
          paymentMethod: data.paymentMethod || "credit_card",
        })
      } catch (error) {
        toast.error("Error loading billing account")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingAccount()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would typically call an API endpoint to update the billing account
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Billing information updated successfully")
      router.push("/billing")
    } catch (error) {
      toast.error("Failed to update billing information")
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

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Billing Information</CardTitle>
          <CardDescription>Update your billing details and payment method</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Textarea
                id="billingAddress"
                name="billingAddress"
                placeholder="Enter your billing address"
                value={formData.billingAddress}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.paymentMethod === "credit_card" && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="•••" />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === "paypal" && (
              <div className="space-y-2 rounded-lg border p-4">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input id="paypalEmail" type="email" placeholder="name@example.com" />
              </div>
            )}

            {formData.paymentMethod === "bank_transfer" && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input id="accountName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input id="routingNumber" placeholder="987654321" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

