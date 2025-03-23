"use server"

import { z } from "zod"
import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export async function submitContactForm(formData: FormData) {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate form data
    const validatedFields = contactFormSchema.safeParse({
      name,
      email,
      subject,
      message,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed. Please check your inputs.",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Create Supabase client
    const supabase = createClientServer()

    // Store message in database
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    })

    if (error) {
      console.error("Error storing contact message:", error)
      return {
        success: false,
        message: "Failed to submit your message. Please try again later.",
      }
    }

    // Revalidate the contact messages page
    revalidatePath("/dashboard/contact-messages")

    return {
      success: true,
      message: "Your message has been received. Thank you for contacting us!",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

