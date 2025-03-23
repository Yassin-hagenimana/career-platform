import { createClientServer } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ContactMessagesPage() {
  const supabase = createClientServer()

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contact messages:", error)
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
        <p className="text-red-500">Failed to load contact messages. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-muted-foreground">No contact messages yet.</p>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.name} ({message.email})
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      message.status === "new"
                        ? "default"
                        : message.status === "in_progress"
                          ? "secondary"
                          : message.status === "completed"
                            ? "success"
                            : "outline"
                    }
                  >
                    {message.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

