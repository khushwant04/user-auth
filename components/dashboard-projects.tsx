import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface Project {
  id: string
  name: string
  description: string | null
  status: string | null
  createdAt: Date
  updatedAt: Date
}

interface DashboardProjectsProps {
  projects: Project[]
}

export function DashboardProjects({ projects }: DashboardProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your recently updated projects</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <Icons.plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <Icons.building className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{project.name}</h4>
                    {project.status && (
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description || "No description"}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/projects/${project.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/projects">View All Projects</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

