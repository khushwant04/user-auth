import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Create a schema for subscription creation
const subscriptionSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.string().optional(),
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
    const { planName, startDate, endDate, status } = subscriptionSchema.parse(body)

    const subscription = await prisma.subscription.create({
      data: {
        billingAccountId: billingAccount.id,
        planName,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || "active",
      },
    })

    return NextResponse.json(subscription, { status: 201 })
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

    const subscriptions = await prisma.subscription.findMany({
      where: {
        billingAccountId: billingAccount.id,
      },
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

