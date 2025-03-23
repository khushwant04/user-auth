import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectList } from "@/components/project-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Fetch user's projects
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and collaborations</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Icons.plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ProjectList projects={projects} />
      </div>
    </main>
  )
}

