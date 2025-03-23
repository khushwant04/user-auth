import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomUUID } from "crypto"

// Create a schema for invoice creation
const invoiceSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  status: z.string().optional(),
  dueDate: z.string().optional(),
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
    const { amount, status, dueDate } = invoiceSchema.parse(body)

    // Generate a unique invoice number
    const invoiceNumber = `INV-${randomUUID().substring(0, 8).toUpperCase()}`

    const invoice = await prisma.invoice.create({
      data: {
        billingAccountId: billingAccount.id,
        invoiceNumber,
        amount,
        status: status || "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
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

    const invoices = await prisma.invoice.findMany({
      where: {
        billingAccountId: billingAccount.id,
      },
      orderBy: {
        issuedDate: "desc",
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

