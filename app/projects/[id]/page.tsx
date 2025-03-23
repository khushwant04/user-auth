import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectActivity } from "@/components/project-activity"

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
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
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Check if user is authorized to view this project
  const isOwner = project.userId === session.user.id
  const isMember = project.members.some((member) => member.user.id === session.user.id)

  if (!isOwner && !isMember) {
    redirect("/projects")
  }

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.status && (
              <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
            )}
          </div>
          <p className="text-muted-foreground">{project.description || "No description provided"}</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/projects">
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          {isOwner && (
            <Button asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Edit Project
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Overview of the project and its details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p>{new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Owner</p>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.user.image || ""} alt={project.user.name || ""} />
                    <AvatarFallback>{project.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{project.user.name}</p>
                    <p className="text-xs text-muted-foreground">{project.user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProjectActivity projectId={project.id} />
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.user.image || ""} alt={member.user.name || ""} />
                            <AvatarFallback>{member.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.user.name}</p>
                            <p className="text-xs text-muted-foreground">{member.user.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{member.role || "Member"}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isOwner && (
                <Button asChild className="w-full">
                  <Link href={`/projects/${project.id}/members`}>
                    <Icons.users className="mr-2 h-4 w-4" />
                    Manage Team
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/projects/${project.id}/tasks`}>
                  <Icons.check className="mr-2 h-4 w-4" />
                  View Tasks
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/projects/${project.id}/files`}>
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  Project Files
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/projects/${project.id}/calendar`}>
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  Project Calendar
                </Link>
              </Button>
              {isOwner && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Link href={`/projects/${project.id}/delete`}>
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete Project
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

