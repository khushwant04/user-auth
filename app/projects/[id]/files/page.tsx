import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProjectFilesPage({
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
  })

  if (!project) {
    notFound()
  }

  // Mock files data - in a real app, this would come from the database
  const files = [
    {
      id: "1",
      name: "Project Requirements.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    {
      id: "2",
      name: "Design Mockups.zip",
      type: "zip",
      size: "15.8 MB",
      uploadedBy: "Jane Smith",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
    {
      id: "3",
      name: "Meeting Notes.docx",
      type: "docx",
      size: "1.2 MB",
      uploadedBy: "Mike Johnson",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "4",
      name: "Project Timeline.xlsx",
      type: "xlsx",
      size: "3.5 MB",
      uploadedBy: "Sarah Williams",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
  ]

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Files for {project.name}</h1>
          <p className="text-muted-foreground">Manage and share project files</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${params.id}`}>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${params.id}/files/upload`}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Upload File
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>Files shared within this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center">
                <Icons.fileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No files yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Upload your first file to get started.</p>
                <Button asChild className="mt-4">
                  <Link href={`/projects/${params.id}/files/upload`}>Upload File</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-3">Uploaded By</div>
                  <div className="col-span-2">Date</div>
                </div>
                {files.map((file) => (
                  <div key={file.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                    <div className="col-span-5 flex items-center">
                      <div className="mr-2">
                        <Icons.fileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center text-muted-foreground">{file.size}</div>
                    <div className="col-span-3 flex items-center text-muted-foreground">{file.uploadedBy}</div>
                    <div className="col-span-2 flex items-center text-muted-foreground">
                      {file.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

