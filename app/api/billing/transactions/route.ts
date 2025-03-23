import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Create a schema for transaction creation
const transactionSchema = z.object({
  invoiceId: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  status: z.string().optional(),
  transactionType: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has a billing account
    const billingAccount = await prisma.billingAccount.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!billingAccount) {
      return NextResponse.json({ error: "Billing account not found" }, { status: 404 })
    }

    const body = await req.json()
    const { invoiceId, amount, status, transactionType } = transactionSchema.parse(body)

    // If invoiceId is provided, check if it exists and belongs to the user
    if (invoiceId) {
      const invoice = await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          billingAccountId: billingAccount.id,
        },
      })

      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found or does not belong to user" }, { status: 404 })
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        billingAccountId: billingAccount.id,
        invoiceId,
        amount,
        status: status || "success",
        transactionType: transactionType || "credit",
      },
    })

    // If this is a successful payment for an invoice, update the invoice status
    if (invoiceId && status === "success" && transactionType === "credit") {
      await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          status: "paid",
          paidDate: new Date(),
        },
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has a billing account
    const billingAccount = await prisma.billingAccount.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!billingAccount) {
      return NextResponse.json({ error: "Billing account not found" }, { status: 404 })
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        billingAccountId: billingAccount.id,
      },
      include: {
        invoice: true,
      },
      orderBy: {
        transactionDate: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

