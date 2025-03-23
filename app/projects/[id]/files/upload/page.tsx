"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

export default function UploadFilePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setIsLoading(true)

    try {
      // This would typically call an API endpoint to upload a file
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("File uploaded successfully")
      router.push(`/projects/${params.id}/files`)
    } catch (error) {
      toast.error("Failed to upload file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Upload a file to your project</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <div className="rounded-md border border-dashed p-8 text-center">
                {file ? (
                  <div className="space-y-2">
                    <Icons.fileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Icons.fileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag and drop a file here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports all file types up to 50MB</p>
                    <Input id="file" type="file" className="hidden" onChange={handleFileChange} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter file description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Upload File
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

