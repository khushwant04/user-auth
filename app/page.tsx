import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserAuthForm } from "@/components/user-auth-form"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {session ? "You are signed in!" : "Sign in to your account"}
          </p>
        </div>

        {session ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                {session.user?.image && (
                  <img
                    src={session.user.image || "/placeholder.svg"}
                    alt={session.user.name || "User"}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <UserAuthForm />
        )}
      </div>
    </main>
  )
}

