"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ApplyRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get all the query parameters
    const params = new URLSearchParams(searchParams)
    // Redirect to the apply-form page with the same query parameters
    router.replace(`/funding/apply-form?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

