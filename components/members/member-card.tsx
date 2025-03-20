"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, UserPlus, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

type MemberProps = {
  member: {
    id: string
    full_name: string
    avatar_url: string
    title: string
    company: string
    bio: string
    skills: string[] | string | null
    location: string
  }
}

export function MemberCard({ member }: MemberProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const initials =
    member.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  // Parse skills to ensure we have an array
  const parseSkills = (): string[] => {
    if (!member.skills) return []

    // If skills is already an array
    if (Array.isArray(member.skills)) {
      return member.skills
    }

    // If skills is a string, try to parse it as JSON
    if (typeof member.skills === "string") {
      try {
        const parsed = JSON.parse(member.skills)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        // If it's not valid JSON, split by comma
        return member.skills.split(",").map((skill) => skill.trim())
      }
    }

    return []
  }

  const skills = parseSkills()

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with members",
        variant: "destructive",
      })
      return
    }

    if (user.id === member.id) {
      toast({
        title: "Cannot connect with yourself",
        description: "You cannot connect with your own profile",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)

      // In a real implementation, you would create a connection in the database
      // For now, we'll just simulate the connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(true)
      toast({
        title: "Connection request sent",
        description: `You've sent a connection request to ${member.full_name}`,
      })
    } catch (error) {
      console.error("Error connecting with member:", error)
      toast({
        title: "Connection failed",
        description: "There was an error sending your connection request",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleMessage = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message members",
        variant: "destructive",
      })
      return
    }

    if (user.id === member.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot send a message to your own profile",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Messaging coming soon",
      description: "Direct messaging functionality will be available soon!",
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar_url} alt={member.full_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${member.id}`} className="font-medium hover:underline">
              {member.full_name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {member.title} {member.company ? `at ${member.company}` : ""}
            </p>
            {member.location && <p className="text-xs text-muted-foreground">{member.location}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm line-clamp-3">{member.bio || "No bio provided"}</p>
        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={`${skill}-${index}`} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" className="w-[48%]" onClick={handleMessage}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </Button>
        <Button
          variant={isConnected ? "secondary" : "default"}
          size="sm"
          className="w-[48%]"
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
        >
          {isConnected ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Connect
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}