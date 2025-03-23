"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

export default function PayInvoicePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would typically call an API endpoint to process payment
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Payment processed successfully")
      router.push(`/billing/invoices/${params.id}`)
    } catch (error) {
      toast.error("Failed to process payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Pay Invoice</CardTitle>
          <CardDescription>Complete payment for invoice</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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

            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" required />
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Bank Transfer Details</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Bank Name:</span> Example Bank
                    </p>
                    <p>
                      <span className="font-medium">Account Name:</span> Your Company Name
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span> 1234567890
                    </p>
                    <p>
                      <span className="font-medium">Routing Number:</span> 987654321
                    </p>
                    <p>
                      <span className="font-medium">Reference:</span> INV-12345
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transferReference">Transfer Reference</Label>
                  <Input id="transferReference" placeholder="Enter your transfer reference" required />
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
              {paymentMethod === "paypal" ? "Continue to PayPal" : "Pay Now"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

