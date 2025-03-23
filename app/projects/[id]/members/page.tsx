"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

interface ProjectMember {
  id: string
  role: string | null
  user: User
}

interface Project {
  id: string
  name: string
  members: ProjectMember[]
}

export default function ProjectMembersPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [isAddingMember, setIsAddingMember] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Project not found")
            router.push("/projects")
            return
          }
          throw new Error("Failed to fetch project")
        }

        const projectData = await response.json()
        setProject(projectData)
      } catch (error) {
        toast.error("Error loading project")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingMember(true)

    try {
      // This would typically call an API endpoint to add a member
      // For now, we'll just simulate it
      toast.success(`Invitation sent to ${email}`)
      setEmail("")

      // In a real app, you would refresh the member list here
    } catch (error) {
      toast.error("Failed to add team member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      // This would typically call an API endpoint to remove a member
      // For now, we'll just simulate it
      toast.success("Team member removed")

      // In a real app, you would refresh the member list here
      if (project) {
        setProject({
          ...project,
          members: project.members.filter((member) => member.id !== memberId),
        })
      }
    } catch (error) {
      toast.error("Failed to remove team member")
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-3xl py-10">
        <div className="flex items-center justify-center h-[400px]">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The project you are looking for does not exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Team Members</h1>
        <Button asChild variant="outline">
          <Link href={`/projects/${params.id}`}>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription>Invite someone to collaborate on this project</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddMember}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isAddingMember}>
              {isAddingMember && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Add Team Member
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People with access to this project</CardDescription>
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
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{member.role || "Member"}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                        <Icons.trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove</span>
                      </Button>
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

