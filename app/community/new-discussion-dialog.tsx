"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
})

const CATEGORIES = [
  "Career Advice",
  "Technical",
  "Education",
  "Entrepreneurship",
  "Job Hunting",
  "Networking",
  "Work-Life Balance",
  "Industry News",
  "Projects",
  "Other",
]

export function NewDiscussionDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  })
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      title: "",
      category: "",
      content: "",
    }

    if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters."
      valid = false
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters."
      valid = false
    }

    if (!formData.category) {
      newErrors.category = "Please select a category."
      valid = false
    }

    if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()

    if (!validateForm()) return

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a discussion",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Insert the discussion
      const { data: discussion, error: discussionError } = await supabase
        .from("discussions")
        .insert({
          title: formData.title,
          category: formData.category,
          author_id: user.id,
          replies: 0,
          views: 0,
          likes: 0,
          last_activity: new Date().toISOString(),
          isPopular: false,
        })
        .select()
        .single()

      if (discussionError) throw discussionError

      // Insert the discussion content
      const { error: contentError } = await supabase.from("discussion_contents").insert({
        discussion_id: discussion.id,
        content: formData.content,
        author_id: user.id,
      })

      if (contentError) throw contentError

      toast({
        title: "Success",
        description: "Your discussion has been created",
      })

      setOpen(false)
      setFormData({
        title: "",
        category: "",
        content: "",
      })

      // Navigate to the new discussion
      router.push(`/community/discussion/${discussion.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating discussion:", error)
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Button asChild>
        <a href="/auth/login?redirect=/community">
          <MessageSquare className="mr-2 h-4 w-4" />
          Start Discussion
        </a>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Start Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or start a conversation with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share your thoughts, questions, or ideas..."
              className="min-h-[200px]"
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Discussion"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

