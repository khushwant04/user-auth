"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import Link from "next/link"

export default function DeleteProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast.success("Project deleted successfully")
      router.push("/projects")
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Delete Project</CardTitle>
          <CardDescription>Are you sure you want to delete this project? This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deleting this project will remove all associated data, including team members, tasks, and files.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href={`/projects/${params.id}`}>Cancel</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete Project
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

