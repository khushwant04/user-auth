import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProjectTasksPage({
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
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Mock tasks data - in a real app, this would come from the database
  const tasks = [
    {
      id: "1",
      title: "Design project wireframes",
      status: "completed",
      assignee: "John Doe",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    },
    {
      id: "2",
      title: "Implement frontend components",
      status: "in-progress",
      assignee: "Jane Smith",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    },
    {
      id: "3",
      title: "Set up database schema",
      status: "pending",
      assignee: "Mike Johnson",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    },
    {
      id: "4",
      title: "Write API documentation",
      status: "pending",
      assignee: null,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
    },
  ]

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks for {project.name}</h1>
          <p className="text-muted-foreground">Manage and track project tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${params.id}`}>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${params.id}/tasks/new`}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>To Do</CardTitle>
            <CardDescription>Tasks that need to be started</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === "pending")
                .map((task) => (
                  <div key={task.id} className="rounded-md border p-3 shadow-sm">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Assignee: {task.assignee || <span className="italic">Unassigned</span>}</div>
                      <div>Due: {task.dueDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "pending").length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No pending tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Tasks currently being worked on</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === "in-progress")
                .map((task) => (
                  <div key={task.id} className="rounded-md border p-3 shadow-sm">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Assignee: {task.assignee || <span className="italic">Unassigned</span>}</div>
                      <div>Due: {task.dueDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "in-progress").length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No tasks in progress
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Completed</CardTitle>
            <CardDescription>Tasks that have been finished</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <div key={task.id} className="rounded-md border p-3 shadow-sm">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Assignee: {task.assignee || <span className="italic">Unassigned</span>}</div>
                      <div>Due: {task.dueDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "completed").length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No completed tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

