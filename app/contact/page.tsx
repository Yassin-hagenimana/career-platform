import type { Metadata } from "next"
import { ContactForm } from "./contact-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | CareerEmpowers",
  description: "Get in touch with the CareerEmpowers team for support, partnerships, or general inquiries.",
}

export default function ContactPage() {
  return (
    <>
      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
                <p className="mt-4 text-muted-foreground">
                  Have questions or feedback? We'd love to hear from you. Fill out the form and our team will get back
                  to you as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">support@careerempowers.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">+250 786621407</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-sm text-muted-foreground">
                      Career Empowers Hub, <br />
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

