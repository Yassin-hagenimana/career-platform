"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, Users } from "lucide-react"
// Import the server action
import { registerForWorkshop } from "@/app/actions/workshop-actions"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

const workshopRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  organization: z.string().optional(),
  attendanceMode: z.enum(["in-person", "virtual"], {
    required_error: "Please select attendance mode.",
  }),
  dietaryRequirements: z.string().optional(),
  specialRequests: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

interface WorkshopRegistrationDialogProps {
  workshop: {
    id: number
    title: string
    date: string
    time: string
    attendees?: number
  }
}

export function WorkshopRegistrationDialog({ workshop }: WorkshopRegistrationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { user } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    attendanceMode: "virtual" as "virtual" | "in-person",
    dietaryRequirements: "",
    specialRequests: "",
    agreeTerms: false,
  })

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (value: "in-person" | "virtual") => {
    setFormData((prev) => ({ ...prev, attendanceMode: value }))
    // Clear error when field is edited
    if (errors.attendanceMode) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.attendanceMode
        return newErrors
      })
    }
  }

  const validateForm = () => {
    try {
      workshopRegistrationSchema.parse(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to register for this workshop",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const submitFormData = new FormData()
      submitFormData.append("workshopId", workshop.id.toString())
      submitFormData.append("userId", user.id)
      submitFormData.append("name", formData.name)
      submitFormData.append("email", formData.email)
      submitFormData.append("phone", formData.phone)
      submitFormData.append("organization", formData.organization || "")
      submitFormData.append("attendanceMode", formData.attendanceMode)
      submitFormData.append("dietaryRequirements", formData.dietaryRequirements || "")
      submitFormData.append("specialRequests", formData.specialRequests || "")

      const result = await registerForWorkshop(submitFormData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        setIsSubmitting(false)
      } else {
        setIsSubmitting(false)
        setIsRegistered(true)
      }
    } catch (error) {
      console.error("Error registering for workshop:", error)
      toast({
        title: "Error",
        description: "Failed to register for workshop. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          // Reset form state when dialog is closed
          setFormData({
            name: "",
            email: "",
            phone: "",
            organization: "",
            attendanceMode: "virtual",
            dietaryRequirements: "",
            specialRequests: "",
            agreeTerms: false,
          })
          setErrors({})
          setIsRegistered(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">Register Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!isRegistered ? (
          <>
            <DialogHeader>
              <DialogTitle>Register for Workshop</DialogTitle>
              <DialogDescription>Fill out the form below to register for "{workshop.title}"</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+123456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization/Company (Optional)</Label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Enter your organization or company"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label className={errors.attendanceMode ? "text-destructive" : ""}>How will you attend?</Label>
                  <RadioGroup
                    value={formData.attendanceMode}
                    onValueChange={handleRadioChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem id="in-person" value="in-person" />
                      <Label htmlFor="in-person" className="font-normal">
                        In-person
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem id="virtual" value="virtual" />
                      <Label htmlFor="virtual" className="font-normal">
                        Virtual (Online)
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.attendanceMode && <p className="text-sm text-destructive">{errors.attendanceMode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRequirements">Dietary Requirements (Optional)</Label>
                  <Textarea
                    id="dietaryRequirements"
                    name="dietaryRequirements"
                    placeholder="Please specify any dietary requirements or restrictions"
                    value={formData.dietaryRequirements}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    For in-person attendees, refreshments will be provided.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Accommodations (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Any special requests or accommodations needed"
                    value={formData.specialRequests}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked === true)}
                    className={errors.agreeTerms ? "border-destructive" : ""}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="agreeTerms" className={errors.agreeTerms ? "text-destructive" : ""}>
                      I agree to the terms and conditions and privacy policy
                    </Label>
                    {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms}</p>}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Registration Successful!</DialogTitle>
              <DialogDescription>You have successfully registered for "{workshop.title}"</DialogDescription>
            </DialogHeader>

            <div className="py-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p>Thank you for registering! We've sent a confirmation email with all the details.</p>
              <div className="bg-muted p-4 rounded-lg text-sm text-left">
                <p className="font-medium mb-2">Workshop Details:</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{workshop.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

