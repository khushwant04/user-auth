import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardProjects } from "@/components/dashboard-projects"
import { DashboardBilling } from "@/components/dashboard-billing"
import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch user's projects
  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  })

  // Fetch user's billing account and recent invoices
  const billingAccount = await prisma.billingAccount.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      invoices: {
        orderBy: {
          issuedDate: "desc",
        },
        take: 3,
      },
    },
  })

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>

      <div className="mt-8">
        <DashboardStats projectCount={projects.length} invoiceCount={billingAccount?.invoices.length || 0} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <DashboardProjects projects={projects} />
        <DashboardBilling billingAccount={billingAccount} invoices={billingAccount?.invoices || []} />
      </div>
    </main>
  )
}

