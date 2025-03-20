"use client"

import { useState } from "react"
import { setupProfileTable } from "@/app/actions/setup-profile-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Database } from "lucide-react"

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const response = await setupProfileTable()
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Profile System Setup
        </CardTitle>
        <CardDescription>Set up the profile table and triggers in your database</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will create the profiles table and set up triggers to automatically create profiles for new users.
          Required for the mentor application system.
        </p>

        {result && (
          <div className={`p-4 rounded-md mb-4 ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <div>
                <h3 className={`text-sm font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                  {result.success ? "Setup Successful" : "Setup Failed"}
                </h3>
                <p className={`text-sm ${result.success ? "text-green-700" : "text-red-700"} mt-1`}>{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSetup} disabled={isLoading} className="w-full">
          {isLoading ? "Setting up..." : "Set Up Profile System"}
        </Button>
      </CardFooter>
    </Card>
  )
}

