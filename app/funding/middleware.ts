import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the URL path is exactly /funding/apply
  if (request.nextUrl.pathname === "/funding/apply") {
    // Rewrite to the actual apply page
    return NextResponse.rewrite(new URL("/funding/apply-form", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/funding/:path*"],
}

