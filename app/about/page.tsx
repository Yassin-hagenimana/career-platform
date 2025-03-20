import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, GraduationCap, Globe, Target, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Yassin Draxler",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Sarah has over 15 years of experience in education and workforce development across Africa. Prior to founding this platform, she led education initiatives at the African Development Bank.",
    },
    {
      name: "Yassin Draxler",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "David brings 10+ years of software engineering experience, having previously built digital platforms for educational institutions across Ghana, Kenya, and Nigeria.",
    },
    {
      name: "Yassin Draxler",
      role: "Head of Partnerships",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Amina has extensive experience in building corporate and NGO partnerships across Africa, with a focus on creating sustainable impact through collaboration.",
    },
    {
      name: "Yassin Draxler",
      role: "Director of Education",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Kwame is an education specialist with a background in curriculum development and e-learning. He oversees all educational content and training programs.",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Our Mission</h1>
            <p className="text-xl text-muted-foreground">
              Empowering African youth with the skills, opportunities, and resources they need to build successful
              careers and contribute to the continent's economic growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild>
                <Link href="/auth/register">Join Our Community</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/partners">Our Partners</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMHN0dWRlbnRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
              alt="African students collaborating"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* About Tabs */}
      <section className="mb-16">
        <Tabs defaultValue="story" className="space-y-8">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
            <TabsTrigger value="story">Our Story</TabsTrigger>
            <TabsTrigger value="vision">Vision & Values</TabsTrigger>
            <TabsTrigger value="impact">Our Impact</TabsTrigger>
            <TabsTrigger value="approach">Our Approach</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <p>
                  Our platform was founded in 2020 by a team of passionate educators, technologists, and business
                  leaders who recognized the gap between education and employment opportunities for African youth.
                </p>
                <p>
                  Despite the continent's growing economy and young population, many talented young Africans struggle to
                  find meaningful employment or access the resources needed to start their own ventures.
                </p>
                <p>
                  We set out to create a comprehensive platform that bridges this gap by providing skills training,
                  mentorship, funding opportunities, and job connections - all tailored to the unique needs and
                  challenges of African youth.
                </p>
              </div>
              <div className="relative h-[250px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWZyaWNhbiUyMGJ1c2luZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                  alt="Platform founders"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-3">Our Journey</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    2020
                  </div>
                  <div>
                    <h4 className="font-medium">Platform Launch</h4>
                    <p className="text-muted-foreground">
                      Started with basic skills training and job listings for three countries: Kenya, Nigeria, and
                      Ghana.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    2021
                  </div>
                  <div>
                    <h4 className="font-medium">Expansion of Services</h4>
                    <p className="text-muted-foreground">
                      Added mentorship programs and funding opportunities for entrepreneurs. Expanded to five more
                      countries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    2022
                  </div>
                  <div>
                    <h4 className="font-medium">Community Growth</h4>
                    <p className="text-muted-foreground">
                      Reached 100,000 users and established partnerships with major employers and educational
                      institutions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    2023
                  </div>
                  <div>
                    <h4 className="font-medium">Today</h4>
                    <p className="text-muted-foreground">
                      Serving youth across 15 African countries with comprehensive career development resources and a
                      thriving community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vision" className="space-y-6">
            <h2 className="text-3xl font-bold">Vision & Values</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="mb-4">
                  We envision an Africa where every young person has access to the skills, opportunities, and resources
                  they need to build a successful career and contribute to the continent's economic growth.
                </p>
                <p>
                  By 2030, we aim to empower 10 million African youth with career development tools, connect them with
                  meaningful employment or entrepreneurship opportunities, and help create a new generation of African
                  leaders and innovators.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Inclusivity</h4>
                      <p className="text-muted-foreground">
                        Creating opportunities for all, regardless of background or circumstances.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quality Education</h4>
                      <p className="text-muted-foreground">Providing world-class, relevant training and resources.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pan-African Collaboration</h4>
                      <p className="text-muted-foreground">
                        Fostering connections across borders to strengthen the continent.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Innovation</h4>
                      <p className="text-muted-foreground">
                        Embracing new ideas and approaches to solve complex challenges.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">250K+</div>
                  <h3 className="font-medium mb-1">Registered Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Young Africans actively using our platform for career development
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">15</div>
                  <h3 className="font-medium mb-1">Countries</h3>
                  <p className="text-sm text-muted-foreground">Across East, West, and Southern Africa</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">45K+</div>
                  <h3 className="font-medium mb-1">Job Placements</h3>
                  <p className="text-sm text-muted-foreground">Users who found employment through our platform</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">$5M+</div>
                  <h3 className="font-medium mb-1">Funding Secured</h3>
                  <p className="text-sm text-muted-foreground">For entrepreneurs and startups on our platform</p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Success Stories</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="User portrait"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Ngozi A.</h4>
                      <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    "Through the platform's tech skills program, I transitioned from an administrative role to a
                    software developer position, tripling my income and opening up global opportunities."
                  </p>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="User portrait"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Thomas M.</h4>
                      <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    "I secured $50,000 in seed funding through the platform's startup program for my agritech venture.
                    We now employ 12 people and serve over 500 farmers."
                  </p>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link href="/testimonials">
                    Read More Success Stories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approach" className="space-y-6">
            <h2 className="text-3xl font-bold">Our Approach</h2>
            <p className="text-lg mb-6">
              We take a holistic approach to career development, addressing the multiple challenges facing African youth
              in today's job market.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Skills Development</h3>
                  <p className="text-muted-foreground">
                    We provide industry-relevant training programs designed in partnership with employers to ensure our
                    users develop the skills that are in demand.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Recognized certifications</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Practical, project-based learning</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Expert-led workshops</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mentorship & Networking</h3>
                  <p className="text-muted-foreground">
                    We connect young professionals with experienced mentors who provide guidance, advice, and valuable
                    industry connections.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>One-on-one mentorship</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Industry networking events</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Peer learning communities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Opportunity Access</h3>
                  <p className="text-muted-foreground">
                    We provide direct access to job opportunities, funding, and resources that might otherwise be
                    inaccessible to many young Africans.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Curated job listings</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Startup funding connections</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Resource libraries</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate individuals driving our mission to empower African youth
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white p-8 rounded-lg">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Join Our Mission</h2>
          <p className="text-lg opacity-90">
            Whether you're a student, job seeker, entrepreneur, or potential partner, there's a place for you in our
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

