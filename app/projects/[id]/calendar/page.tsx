import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProjectCalendarPage({
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

  // Mock events data - in a real app, this would come from the database
  const events = [
    {
      id: "1",
      title: "Project Kickoff Meeting",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      time: "10:00 AM - 11:30 AM",
      attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    },
    {
      id: "2",
      title: "Design Review",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      time: "2:00 PM - 3:00 PM",
      attendees: ["John Doe", "Sarah Williams"],
    },
    {
      id: "3",
      title: "Sprint Planning",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      time: "9:00 AM - 10:30 AM",
      attendees: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"],
    },
    {
      id: "4",
      title: "Client Presentation",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
      time: "1:00 PM - 2:30 PM",
      attendees: ["John Doe", "Jane Smith"],
    },
  ]

  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateStr = event.date.toDateString()
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(event)
      return acc
    },
    {} as Record<string, typeof events>,
  )

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar for {project.name}</h1>
          <p className="text-muted-foreground">Schedule and manage project events</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${params.id}`}>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${params.id}/calendar/new`}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Scheduled events for this project</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Icons.calendar className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No events scheduled</h3>
              <p className="mt-2 text-sm text-muted-foreground">Schedule your first event to get started.</p>
              <Button asChild className="mt-4">
                <Link href={`/projects/${params.id}/calendar/new`}>Add Event</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateStr) => (
                <div key={dateStr}>
                  <h3 className="mb-4 font-semibold">
                    {new Date(dateStr).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="space-y-3">
                    {eventsByDate[dateStr].map((event) => (
                      <div key={event.id} className="rounded-md border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <span className="text-sm text-muted-foreground">{event.time}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Attendees: {event.attendees.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

