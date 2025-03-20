import Link from "next/link"
import Image from "next/image"
import { GraduationCap, Users, LineChart, Globe, ArrowRight, Briefcase, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImpactStats from "@/components/impact-stats"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary w-full py-20 px-4 md:px-6">
        <div className="container mx-auto grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Empowering African Youth Through Career Development
            </h1>
            <p className="text-lg md:text-xl max-w-md opacity-90">
              Connect with opportunities, develop skills, and secure funding to build a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/20 text-white border-white hover:bg-white/30">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[350px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMHN0dWRlbnRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
              alt="African youth in professional settings"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Career Development Tools</h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides essential resources to help you succeed in today's competitive job market
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Career Training</CardTitle>
                <CardDescription>Access industry-relevant courses and skills certification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGVudHMlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Career training courses"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Learn in-demand skills with our structured modules and receive certifications recognized by employers
                  across Africa.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  Explore courses <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Live Workshops</CardTitle>
                <CardDescription>Interactive sessions with industry professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdvcmtzaG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                    alt="Live workshop session"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Join live workshops and webinars conducted by industry experts to gain practical insights and
                  networking opportunities.
                </p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  View upcoming workshops <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Startup Funding</CardTitle>
                <CardDescription>Access to capital for entrepreneurial ventures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnVuZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Startup funding"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Apply for startup funding, connect with investors, and transform your innovative ideas into successful
                  businesses.
                </p>
                <Link
                  href="/funding"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  Learn about funding <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Job Opportunities</CardTitle>
                <CardDescription>Connect with employers across Africa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGpvYiUyMGludGVydmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Job opportunities"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Discover job listings from top employers across the continent, perfectly matched to your skills and
                  career goals.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  Browse jobs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Network</CardTitle>
                <CardDescription>Connect with peers and mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZGVudHMlMjBuZXR3b3JraW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                    alt="Community networking"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Join a thriving community of like-minded individuals to share experiences, advice, and career
                  opportunities.
                </p>
                <Link
                  href="/community"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  Join community <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mentorship</CardTitle>
                <CardDescription>Guidance from experienced professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVudG9yaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                    alt="Mentorship program"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>
                  Connect with experienced mentors who can provide personalized guidance on your career development
                  journey.
                </p>
                <Link
                  href="/mentors"
                  className="inline-flex items-center text-primary mt-4 text-sm font-medium hover:underline"
                >
                  Find a mentor <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 px-4 md:px-6 bg-muted">
        <ImpactStats />
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              Hear from users who have transformed their careers through our platform
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Our Partners</h2>
            <p className="text-lg text-muted-foreground">
              We collaborate with leading organizations to provide the best opportunities for African youth
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {/* <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=100&width=120"
                alt="Partner Logo 1"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120"
                alt="Partner Logo 2"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>*/}
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120"
                alt="Partner Logo 3"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120"
                alt="Partner Logo 4"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div> 
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/17/Coat_of_arms_of_Rwanda.svg?height=100&width=120"
                alt="Partner Logo 5"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120"
                alt="Partner Logo 6"
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          </div>

          <div className="text-center pt-8">
            <Button variant="outline" asChild>
              <Link href="/partners">View All Partners</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-4 md:px-6">
        <div className="container mx-auto text-center space-y-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Career?</h2>
          <p className="text-lg opacity-90">
            Join thousands of African youth who are developing skills, finding opportunities, and building successful
            careers.
          </p>
          <div className="pt-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/auth/register">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

