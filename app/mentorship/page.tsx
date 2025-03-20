import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Search, ArrowRight, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample mentors data
const mentors = [
  {
    id: 1,
    name: "Dr. Amina Diallo",
    title: "Senior Software Engineer at Google",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Software Development", "Career Transitions", "Technical Interviews"],
    rating: 4.9,
    reviews: 42,
    availability: "2-3 hours/week",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Okafor",
    title: "Startup Founder & Business Coach",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Entrepreneurship", "Business Strategy", "Fundraising"],
    rating: 4.8,
    reviews: 35,
    availability: "1-2 hours/week",
    featured: true,
  },
  {
    id: 3,
    name: "Sarah Mensah",
    title: "Marketing Director at AfriTech",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Creation"],
    rating: 4.7,
    reviews: 28,
    availability: "3-4 hours/week",
    featured: false,
  },
  {
    id: 4,
    name: "David Nkosi",
    title: "Financial Analyst at PanAfrican Bank",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Financial Planning", "Investment Strategy", "FinTech"],
    rating: 4.6,
    reviews: 31,
    availability: "2-3 hours/week",
    featured: false,
  },
  {
    id: 5,
    name: "Grace Osei",
    title: "HR Manager at TechAfrica",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Resume Building", "Interview Preparation", "Career Planning"],
    rating: 4.9,
    reviews: 47,
    availability: "2-3 hours/week",
    featured: false,
  },
  {
    id: 6,
    name: "John Kamau",
    title: "Product Manager at Microsoft",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Product Management", "UX Design", "Tech Career Advice"],
    rating: 4.8,
    reviews: 39,
    availability: "1-2 hours/week",
    featured: false,
  },
]

export default function MentorshipPage() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Find a Mentor</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Connect with experienced professionals who can provide personalized guidance on your career journey
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search mentors by name or expertise..." className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expertise</SelectItem>
              <SelectItem value="software">Software Development</SelectItem>
              <SelectItem value="business">Business & Entrepreneurship</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="career">Career Development</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="availability">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="availability">Any Availability</SelectItem>
              <SelectItem value="high">High (3+ hours/week)</SelectItem>
              <SelectItem value="medium">Medium (1-3 hours/week)</SelectItem>
              <SelectItem value="low">Low (&lt; 1 hour/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList>
          <TabsTrigger value="all">All Mentors</TabsTrigger>
          <TabsTrigger value="featured">Featured Mentors</TabsTrigger>
          <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {/* Featured Mentors */}
          {mentors.filter((mentor) => mentor.featured).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Featured Mentors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors
                  .filter((mentor) => mentor.featured)
                  .map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col md:flex-row overflow-hidden">
                      <div className="relative h-40 w-full md:h-auto md:w-1/3">
                        <Image
                          src={mentor.image || "/placeholder.svg"}
                          alt={mentor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{mentor.name}</h3>
                            <p className="text-muted-foreground">{mentor.title}</p>
                          </div>
                          <Badge>Featured</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 my-3">
                          {mentor.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                            <span>
                              {mentor.rating} ({mentor.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{mentor.availability}</span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/mentorship/request?mentor=${mentor.id}`}>Request Mentorship</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Mentors */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">All Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors
                .filter((mentor) => !mentor.featured)
                .map((mentor) => (
                  <Card key={mentor.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image src={mentor.image || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{mentor.name}</CardTitle>
                      <CardDescription>{mentor.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-500" />
                          <span>
                            {mentor.rating} ({mentor.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{mentor.availability}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/mentorship/request?mentor=${mentor.id}`}>Request Mentorship</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors
              .filter((mentor) => mentor.featured)
              .map((mentor) => (
                <Card key={mentor.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image src={mentor.image || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{mentor.name}</CardTitle>
                        <CardDescription>{mentor.title}</CardDescription>
                      </div>
                      <Badge>Featured</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        <span>
                          {mentor.rating} ({mentor.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{mentor.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/mentorship/request?mentor=${mentor.id}`}>Request Mentorship</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.slice(0, 3).map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={mentor.image || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{mentor.name}</CardTitle>
                  <CardDescription>{mentor.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-500" />
                      <span>
                        {mentor.rating} ({mentor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{mentor.availability}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/mentorship/request?mentor=${mentor.id}`}>Request Mentorship</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* How It Works Section */}
      <div className="mt-16 bg-muted rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">How Mentorship Works</h2>
          <p className="text-muted-foreground mt-2">Our mentorship program is designed to be flexible and effective</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-background rounded-lg p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Find a Mentor</h3>
            <p className="text-sm text-muted-foreground">
              Browse our network of experienced professionals and find someone who matches your career goals.
            </p>
          </div>
          <div className="bg-background rounded-lg p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect & Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Send a mentorship request, and once accepted, schedule your first session at a time that works for both of
              you.
            </p>
          </div>
          <div className="bg-background rounded-lg p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Grow & Develop</h3>
            <p className="text-sm text-muted-foreground">
              Receive personalized guidance, feedback, and support to help you achieve your career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Become a Mentor CTA */}
      <div className="mt-16 bg-primary text-primary-foreground rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-bold">Share Your Expertise</h2>
            <p className="opacity-90">
              Are you an experienced professional? Join our mentorship program to guide the next generation of African
              talent.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/mentorship/become-mentor">
                Become a Mentor <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative h-48 w-full md:w-1/3 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=400&text=Become+a+Mentor"
              alt="Become a mentor"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

