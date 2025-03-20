"use client"

import type React from "react"

import { useState } from "react"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, User, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardNav from "@/components/dashboard-nav"

// Sample contacts data
const contacts = [
  {
    id: 1,
    name: "Dr. Ngozi Okonkwo",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Let's discuss your project proposal",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Michael Abebe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thanks for the feedback on my code",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Fatima El-Rashid",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "The marketing strategy looks great!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 4,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "When can we schedule the next meeting?",
    time: "Monday",
    unread: 0,
  },
]

// Sample messages for the selected conversation
const sampleMessages = [
  {
    id: 1,
    sender: "Dr. Ngozi Okonkwo",
    content: "Hello! I saw your profile and I'm impressed with your work.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Thank you! I appreciate that.",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Dr. Ngozi Okonkwo",
    content:
      "I have a project that might interest you. It's about developing a mobile app for healthcare access in rural areas.",
    time: "10:35 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "That sounds interesting! I'd love to hear more about it.",
    time: "10:38 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Dr. Ngozi Okonkwo",
    content:
      "Great! Let's discuss your project proposal. I've prepared some initial thoughts and would like to get your feedback.",
    time: "10:42 AM",
    isMe: false,
  },
]

export default function DashboardMessagesPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      // In a real app, you would send this message to your backend
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardNav activeItem="messages" />

      <div className="flex-1 flex">
        {/* Contacts sidebar */}
        <div className="w-80 border-r bg-background">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search messages..." className="pl-8" />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left ${
                    selectedContact?.id === contact.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.status === "online" && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-muted-foreground">{contact.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.status === "online" ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Last seen recently
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Block Contact</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {sampleMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

