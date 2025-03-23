import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomUUID } from "crypto"

// Create a schema for billing account creation
const billingAccountSchema = z.object({
  billingAddress: z.string().min(1, "Billing address is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has a billing account
    const existingAccount = await prisma.billingAccount.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (existingAccount) {
      return NextResponse.json({ error: "Billing account already exists" }, { status: 400 })
    }

    const body = await req.json()
    const { billingAddress, paymentMethod } = billingAccountSchema.parse(body)

    // Generate a unique account number
    const accountNumber = `ACC-${randomUUID().substring(0, 8).toUpperCase()}`

    const billingAccount = await prisma.billingAccount.create({
      data: {
        userId: session.user.id,
        accountNumber,
        billingAddress,
        paymentMethod,
      },
    })

    return NextResponse.json(billingAccount, { status: 201 })
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

    const billingAccount = await prisma.billingAccount.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        subscriptions: true,
        invoices: {
          orderBy: {
            issuedDate: "desc",
          },
        },
      },
    })

    if (!billingAccount) {
      return NextResponse.json({ error: "Billing account not found" }, { status: 404 })
    }

    return NextResponse.json(billingAccount)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

