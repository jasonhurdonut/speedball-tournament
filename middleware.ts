import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the admin page
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // In a real app, we would check for a session cookie or token
    // For this demo, we'll just redirect to login if there's no user in localStorage
    // Note: This is client-side protection only. The page component also has protection.
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

