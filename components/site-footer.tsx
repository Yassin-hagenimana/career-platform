import Link from "next/link"
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">CareerEmpowers</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Empowering African youth with the skills, connections, and opportunities needed to build successful careers
            and businesses.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link href="/courses" className="text-muted-foreground hover:text-primary text-sm">
              Courses
            </Link>
            <Link href="/workshops" className="text-muted-foreground hover:text-primary text-sm">
              Workshops
            </Link>
            <Link href="/funding" className="text-muted-foreground hover:text-primary text-sm">
              Funding
            </Link>
            <Link href="/jobs" className="text-muted-foreground hover:text-primary text-sm">
              Jobs
            </Link>
            <Link href="/community" className="text-muted-foreground hover:text-primary text-sm">
              Community
            </Link>
            <Link href="/mentors" className="text-muted-foreground hover:text-primary text-sm">
              Mentorship
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Support</h3>
          <nav className="flex flex-col space-y-2">
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
              Help Center
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
              FAQs
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm">
              Contact Us
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
              Terms of Service
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Stay Updated</h3>
          <p className="text-muted-foreground text-sm">
            Subscribe to our newsletter for the latest opportunities and updates.
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input type="email" placeholder="Your email" />
            </div>
            <Button size="icon">
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Subscribe</span>
            </Button>
          </div>
          <div className="pt-2">
            <Link
              href="mailto:support@careerempowers.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              <span>support@careerempowers.com</span>
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CareerEmpowers. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}

