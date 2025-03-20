"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah Okafor",
    role: "Software Developer",
    location: "Lagos, Nigeria",
    image: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    content:
      "The training I received through CareerEmpowers transformed my prospects. After completing the software development course, I landed a job at a leading tech company, tripling my previous salary.",
  },
  {
    id: 2,
    name: "Emmanuel Kwame",
    role: "E-commerce Entrepreneur",
    location: "Accra, Ghana",
    image: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    content:
      "The funding application process was straightforward, and the mentorship I received helped me launch my e-commerce business. In just one year, we've grown to a team of 15 employees.",
  },
  {
    id: 3,
    name: "Amina Diallo",
    role: "Digital Marketing Specialist",
    location: "Dakar, Senegal",
    image: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    content:
      "The digital marketing workshops and certification gave me the skills I needed to start freelancing. Now I work with clients globally while mentoring other young marketers in my community.",
  },
  {
    id: 4,
    name: "David Mutua",
    role: "Renewable Energy Consultant",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=200",
    content:
      "Through the platform's networking events, I connected with investors interested in sustainable energy. Today, my solar power startup serves thousands of homes in rural Kenya.",
  },
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Determine visible testimonials based on viewport
  // For mobile: show 1, tablet: show 2, desktop: show 3
  const getVisibleTestimonials = () => {
    const visibleCount =
      typeof window !== "undefined" ? (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3) : 1

    const result = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  return (
    <div className="relative">
      <div className="flex overflow-x-hidden py-8">
        <div className="flex transition-transform duration-300 ease-in-out gap-6 px-4">
          {getVisibleTestimonials().map((testimonial) => (
            <Card key={testimonial.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[380px] flex-shrink-0">
              <CardContent className="p-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/40" />
                <p className="text-muted-foreground">{testimonial.content}</p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full" suppressHydrationWarning>
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

