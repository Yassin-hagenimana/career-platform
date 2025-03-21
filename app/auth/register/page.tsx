"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "@/app/actions/auth-actions"

// List of African countries
const africaCountries = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Côte d'Ivoire",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "São Tomé and Príncipe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
]

// Initial form state
const initialFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  userType: "jobseeker",
  country: "",
  agreeTerms: false,
}

// Initial errors state
const initialErrorsState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  userType: "",
  country: "",
  agreeTerms: "",
}

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrorsState)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null)
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null)
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))

    // Clear error when user checks
    if (errors.agreeTerms) {
      setErrors((prev) => ({ ...prev, agreeTerms: "" }))
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null)
    }
  }

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setFormData((prev) => ({ ...prev, userType: value }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = { ...initialErrorsState }
    let isValid = true

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
      isValid = false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
      isValid = false
    }

    // Phone number validation
    if (formData.phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number."
      isValid = false
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = "Please select your country."
      isValid = false
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setServerError(null)

    try {
      console.log("Submitting registration form:", {
        email: formData.email,
        name: formData.name,
        userType: formData.userType,
        country: formData.country,
      })

      // Try using the server action directly instead of the API route
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType,
        country: formData.country,
      })

      if (!result.success) {
        console.error("Registration error:", result.error)
        setServerError(result.error || "Registration failed")
        throw new Error(result.error || "Registration failed")
      }

      console.log("Registration successful")
      toast({
        title: "Success!",
        description: "Your account has been successfully created",
      })

      // Redirect to login page after successful registration
      router.push("/auth/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-screen-lg mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-6 text-center">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">CareerEmpowers</span>
        </Link>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Join our platform to access career opportunities, training, and funding.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-8">
        <Tabs defaultValue="jobseeker" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="jobseeker">Job Seeker</TabsTrigger>
            <TabsTrigger value="entrepreneur">Entrepreneur</TabsTrigger>
            <TabsTrigger value="mentor">Mentor</TabsTrigger>
          </TabsList>

          {serverError && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
              <p className="font-medium">Registration Error</p>
              <p className="text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+123456789"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {africaCountries.map((country) => (
                    <SelectItem key={country} value={country.toLowerCase()}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex flex-row items-start space-x-3 space-y-0 py-4">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={handleCheckboxChange}
                className={errors.agreeTerms ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="agreeTerms">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    privacy policy
                  </Link>
                </Label>
                {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  )
}
