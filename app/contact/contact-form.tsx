"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/app/actions/contact-actions"
import { toast } from "@/components/ui/use-toast"

export function ContactForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
      isValid = false
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
      isValid = false
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
      isValid = false
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Create FormData object
    const formDataObj = new FormData()
    formDataObj.append("name", formData.name)
    formDataObj.append("email", formData.email)
    formDataObj.append("subject", formData.subject)
    formDataObj.append("message", formData.message)

    try {
      const result = await submitContactForm(formDataObj)

      if (result.success) {
        toast({
          title: "Message sent",
          description: result.message || "Thank you for contacting us. We'll get back to you soon.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send your message. Please try again.",
          variant: "destructive",
        })

        // Set form errors if they exist
        if (result.errors) {
          const serverErrors = {} as typeof errors
          Object.entries(result.errors).forEach(([key, value]) => {
            if (key in errors) {
              serverErrors[key as keyof typeof errors] = value[0]
            }
          })
          setErrors((prev) => ({ ...prev, ...serverErrors }))
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is your message about?"
          className={errors.subject ? "border-red-500" : ""}
        />
        {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please provide details about your inquiry..."
          className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}

