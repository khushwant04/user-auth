"use client"

import type { User } from "next-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface UserProfileProps {
  user: User & {
    id?: string
    role?: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          {user.role && <p className="text-sm text-muted-foreground">Role: {user.role}</p>}
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            signOut({ callbackUrl: "/" }).then(() => {
              toast.success("Signed out successfully")
            })
          }}
        >
          Sign Out
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Account Information</h3>
            <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

