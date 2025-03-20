"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { signIn, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  // If user state changes, redirect
  useEffect(() => {
    if (user && !isRedirecting) {
      console.log("Login page: User detected, redirecting to", redirectUrl)
      setIsRedirecting(true)

      // Use window.location.href directly to redirect immediately
      window.location.href = `${redirectUrl}?auth_bypass=true&t=${Date.now()}`
    }
  }, [user, redirectUrl, isRedirecting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || isRedirecting) return

    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Success message
      toast({
        title: "Success",
        description: "You have been logged in successfully. Redirecting...",
      })

      // Directly redirect after successful login in case useEffect doesn't trigger immediately
      window.location.href = `${redirectUrl}?auth_bypass=true&t=${Date.now()}`

      // Set redirecting state to prevent further actions
      setIsRedirecting(true)

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-none">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">CareerEmpowers</span>
          </Link>
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue your career journey</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yassin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isRedirecting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isRedirecting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
              {isRedirecting ? "Redirecting..." : isLoading ? "Signing in..." : "Sign in"}
            </Button>
            {isRedirecting && (
              <div className="text-center text-sm text-muted-foreground">
                If you are not redirected automatically,
                <a href={`${redirectUrl}?auth_bypass=true`} className="text-primary hover:underline ml-1">
                  click here
                </a>
              </div>
            )}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

