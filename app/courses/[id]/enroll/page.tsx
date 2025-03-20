"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, CreditCard, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Import the server action
import { enrollInCourse } from "@/app/actions/course-actions"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

// Default course data
const defaultCourse = {
  id: 1,
  title: "Loading course...",
  description: "",
  image: "/placeholder.svg?height=200&width=400",
  price: "$0.00",
  instructor: "",
}

export default function CourseEnrollmentPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Add these hooks to the component
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [courseData, setCourseData] = useState(defaultCourse)
  const router = useRouter()

  // Add useEffect to fetch real course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!params.id) return

      try {
        const { data, error } = await supabase.from("courses").select("*").eq("id", params.id).single()

        if (error) throw error
        if (data) setCourseData(data)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        })
      }
    }

    fetchCourse()
  }, [params.id, supabase])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!paymentMethod) {
      errors.paymentMethod = "Please select a payment method."
    }

    if (paymentMethod === "credit-card") {
      if (!cardNumber) errors.cardNumber = "Card number is required."
      if (!cardName) errors.cardName = "Name on card is required."
      if (!expiryDate) errors.expiryDate = "Expiry date is required."
      if (!cvv) errors.cvv = "CVV is required."
    }

    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the terms and conditions."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to enroll in this course",
          variant: "destructive",
        })
        router.push(`/auth/login?redirect=/courses/${params.id}/enroll`)
        return
      }

      const formData = new FormData()
      formData.append("courseId", params.id)
      formData.append("userId", user.id)
      formData.append("paymentMethod", paymentMethod || "")

      const result = await enrollInCourse(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsEnrolled(true)
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast({
        title: "Error",
        description: "Failed to complete enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEnrolled) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Enrollment Successful!</CardTitle>
            <CardDescription>You are now enrolled in {courseData.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              Thank you for enrolling in this course. You can now access all course materials and start learning.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Visit your dashboard to access the course</li>
                <li>Complete your student profile</li>
                <li>Join the course community forum</li>
                <li>Set up your learning schedule</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/courses">Browse More Courses</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/courses">Go to My Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/courses/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Enroll in Course</h1>
        <p className="text-muted-foreground mt-2">Complete your enrollment for {courseData.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="credit-card" className="font-normal flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit or Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="paypal" className="font-normal">
                      <div className="flex items-center">
                        <Image
                          src="/placeholder.svg?height=20&width=80"
                          alt="PayPal"
                          width={80}
                          height={20}
                          className="mr-2"
                        />
                        PayPal
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="radio"
                      id="bank-transfer"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={paymentMethod === "bank-transfer"}
                      onChange={() => setPaymentMethod("bank-transfer")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="bank-transfer" className="font-normal">
                      Bank Transfer
                    </Label>
                  </div>
                  {formErrors.paymentMethod && <p className="text-sm text-red-500">{formErrors.paymentMethod}</p>}
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                      {formErrors.cardNumber && <p className="text-sm text-red-500">{formErrors.cardNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                      {formErrors.cardName && <p className="text-sm text-red-500">{formErrors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                        {formErrors.expiryDate && <p className="text-sm text-red-500">{formErrors.expiryDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                        {formErrors.cvv && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      You will be redirected to PayPal to complete your payment after clicking "Complete Enrollment".
                    </p>
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      Bank transfer details will be provided after you complete the enrollment process.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-sm h-40 overflow-y-auto">
                    <p className="mb-2">
                      By enrolling in this course, you agree to the following terms and conditions:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>You will have lifetime access to the course materials.</li>
                      <li>You may not share your account or course materials with others.</li>
                      <li>The course fee is non-refundable after 14 days from enrollment.</li>
                      <li>You acknowledge that this course is for educational purposes only and results may vary.</li>
                      <li>You agree to abide by the community guidelines when participating in course discussions.</li>
                    </ol>
                  </div>

                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="agreeTerms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="agreeTerms">I agree to the terms and conditions and privacy policy</Label>
                      {formErrors.agreeTerms && <p className="text-sm text-red-500">{formErrors.agreeTerms}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Complete Enrollment"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={courseData.image || "/placeholder.svg?height=100&width=100"}
                    alt={courseData.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{courseData.title}</h3>
                  <p className="text-sm text-muted-foreground">Instructor: {courseData.instructor}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Course Price</span>
                  <span>{courseData.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{courseData.price}</span>
              </div>

              <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                <Lock className="h-4 w-4 mr-1" />
                <span>Secure payment</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

