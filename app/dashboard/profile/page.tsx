"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    skills: [] as string[],
    avatar_url: "",
    phone: "",
  })

  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    const fields = [
      formData.full_name,
      formData.title,
      formData.bio,
      formData.location,
      formData.phone,
      Array.isArray(formData.skills) && formData.skills.length > 0,
      formData.avatar_url,
    ]

    const filledFields = fields.filter(Boolean).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completionPercentage = calculateCompletionPercentage()

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          router.push("/auth/login")
          console.log("no user")
          return
        }

        setUser(user)
        console.log("User authenticated:", user.id)

        // Check if profile exists
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
          throw error
        }

        if (profile) {
          console.log("Profile found:", profile)
          // Ensure skills is always an array
          let skillsArray: string[] = []
          if (profile.skills) {
            if (Array.isArray(profile.skills)) {
              skillsArray = profile.skills
            } else if (typeof profile.skills === "string") {
              try {
                // Try parsing as JSON if it's a stringified array
                const parsedSkills = JSON.parse(profile.skills)
                skillsArray = Array.isArray(parsedSkills)
                  ? parsedSkills
                  : profile.skills.split(",").map((s: string) => s.trim())
              } catch (e) {
                // If parsing fails, split by comma
                skillsArray = profile.skills.split(",").map((s: string) => s.trim())
              }
            }
          }

          setFormData({
            full_name: profile.full_name || "",
            title: profile.title || "",
            bio: profile.bio || "",
            location: profile.location || "",
            website: profile.website || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            twitter: profile.twitter || "",
            skills: skillsArray,
            avatar_url: profile.avatar_url || "",
            phone: profile.phone_number || "",
          })
        } else {
          console.log("No profile found, creating new profile for user:", user.id)
          // Create a new profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id, // Set id to user.id (this is the primary key)
              email: user.email,
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url || "",
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating profile:", createError)
            throw createError
          }

          if (newProfile) {
            console.log("New profile created:", newProfile)
            setFormData({
              full_name: newProfile.full_name || "",
              title: newProfile.title || "",
              bio: newProfile.bio || "",
              location: newProfile.location || "",
              website: newProfile.website || "",
              github: newProfile.github || "",
              linkedin: newProfile.linkedin || "",
              twitter: newProfile.twitter || "",
              skills: [],
              avatar_url: newProfile.avatar_url || "",
              phone: newProfile.phone_number || "",
              user_id: user.id,
            })
          }
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error loading profile",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: Array.isArray(prev.skills) ? [...prev.skills, newSkill.trim()] : [newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: Array.isArray(prev.skills) ? prev.skills.filter((skill) => skill !== skillToRemove) : [],
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Make sure we have a valid array for skills
      const skillsArray = Array.isArray(formData.skills) ? formData.skills : []

      // Use id instead of user_id for the update
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name?.trim() || null,
          title: formData.title?.trim() || null,
          bio: formData.bio?.trim() || null,
          location: formData.location?.trim() || null,
          website: formData.website?.trim() || null,
          github: formData.github?.trim() || null,
          linkedin: formData.linkedin?.trim() || null,
          twitter: formData.twitter?.trim() || null,
          skills: skillsArray,
          phone_number: formData.phone?.trim() || null,
          updated_at: new Date().toISOString(),
          user_id: user.id,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setSaving(true)

      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError, data: uploadData } = await supabase.storage.from("avatars").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName)

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image")
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Update local state
      setFormData((prev) => ({
        ...prev,
        avatar_url: publicUrlData.publicUrl,
      }))

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      })
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error uploading image",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add skills that showcase your expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(formData.skills) &&
                  formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </Button>
                    </Badge>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to increase visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">Your profile is {completionPercentage}% complete</p>
                {completionPercentage < 100 && (
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    {!formData.full_name && <li>Add your full name</li>}
                    {!formData.title && <li>Add your professional title</li>}
                    {!formData.bio && <li>Write a short bio</li>}
                    {!formData.location && <li>Add your location</li>}
                    {!formData.phone && <li>Add your phone number</li>}
                    {(!Array.isArray(formData.skills) || formData.skills.length === 0) && (
                      <li>Add at least one skill</li>
                    )}
                    {!formData.avatar_url && <li>Upload a profile picture</li>}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/*    <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture to personalize your account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={formData.avatar_url || "/placeholder.svg?height=96&width=96"}
                  alt={formData.full_name}
                />
                <AvatarFallback>{formData.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="w-full">
                <div className="flex items-center justify-center w-full border-2 border-dashed border-muted-foreground/25 rounded-md py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{saving ? "Uploading..." : "Upload new image"}</span>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAvatar}
                  disabled={saving}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2 text-center">JPG, PNG or GIF. Max 2MB.</p>
            </CardContent>
          </Card>
          */}
        </div>
      </div>
    </div>
  )
}

