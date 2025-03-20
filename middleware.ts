import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

const REDIRECT_COOKIE = "redirect_count"
const MAX_REDIRECTS = 3

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get the session asynchronously
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session", error.message)
    return res
  }

  if (session === undefined) {
    console.log("Supabase session undefined, skipping redirect")
    return res
  }

  // Get the redirect count from cookies
  const redirectCount = Number.parseInt(req.cookies.get(REDIRECT_COOKIE)?.value || "0")

  // Break redirect loop if too many redirects have occurred
  if (redirectCount >= MAX_REDIRECTS) {
    console.log("Too many redirects detected, proceeding without auth check")
    res.cookies.set(REDIRECT_COOKIE, "0", { httpOnly: true })
    return res
  }

  // Check for auth bypass parameter
  const hasAuthBypass = req.nextUrl.searchParams.has("auth_bypass")

  // Define route checks
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/register")

  // Handle protected routes without a session
  if (isProtectedRoute && !session && !hasAuthBypass) {
    console.log("Middleware: No session found, redirecting to login")

    // Increment redirect count
    const newRedirectCount = redirectCount + 1

    // Redirect to login and preserve attempted URL
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)

    const redirectResponse = NextResponse.redirect(redirectUrl)
    redirectResponse.cookies.set(REDIRECT_COOKIE, newRedirectCount.toString(), { httpOnly: true })

    return redirectResponse
  }

  // Handle auth pages when user is already logged in
  if (isAuthRoute && session) {
    console.log("Middleware: Session found, redirecting to dashboard")

    const dashboardUrl = new URL("/dashboard", req.url)
    dashboardUrl.searchParams.set("auth_bypass", "true") // Ensure one-time bypass

    const redirectResponse = NextResponse.redirect(dashboardUrl)
    redirectResponse.cookies.set(REDIRECT_COOKIE, "0", { httpOnly: true }) // Reset redirect counter

    return redirectResponse
  }

  // Reset redirect counter for normal navigation
  res.cookies.set(REDIRECT_COOKIE, "0", { httpOnly: true })
  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/login", "/auth/register"],
}

