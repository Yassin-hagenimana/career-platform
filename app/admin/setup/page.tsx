"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Shield, Users } from "lucide-react"
import ProfileSetup from "./profile-setup"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Code } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null)

  const seedDatabase = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Database seeded successfully",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to seed database",
          details: data.details,
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground">Configure your CareerEmpowers platform</p>
        </div>
      </div>

      <Tabs defaultValue="database">
        <TabsList className="mb-6">
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Database</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileSetup />

            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Set up your database tables and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure the database schema for your CareerEmpowers platform.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Setup
              </CardTitle>
              <CardDescription>
                Initialize your Supabase database with sample data for the career platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="auto">
                <TabsList className="mb-4">
                  <TabsTrigger value="auto">Automatic Setup</TabsTrigger>
                  <TabsTrigger value="manual">Manual Setup</TabsTrigger>
                </TabsList>

                <TabsContent value="auto">
                  <p className="text-sm text-muted-foreground mb-4">
                    This will seed your database with sample data if the tables already exist. If tables don't exist,
                    you'll need to create them first using the SQL script in the Manual Setup tab.
                  </p>

                  {result && (
                    <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
                      {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>
                        {result.message}
                        {result.details && <p className="mt-2 text-sm">{result.details}</p>}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={seedDatabase} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Seeding database...
                      </>
                    ) : (
                      "Seed Database with Sample Data"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="manual">
                  <div className="space-y-4">
                    <Alert>
                      <Code className="h-4 w-4" />
                      <AlertTitle>Manual Setup Required</AlertTitle>
                      <AlertDescription>
                        To create the database tables, you need to run the SQL script in your Supabase SQL Editor.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Follow these steps:</h3>
                      <ol className="list-decimal list-inside text-sm space-y-2">
                        <li>Go to your Supabase dashboard</li>
                        <li>Navigate to the SQL Editor</li>
                        <li>Create a new query</li>
                        <li>Copy and paste the SQL script below</li>
                        <li>Run the script to create all tables</li>
                        <li>Return to this page and use the "Automatic Setup" tab to seed the database</li>
                      </ol>
                    </div>

                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                        {`-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  country TEXT,
  user_type TEXT
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  enrolled INTEGER DEFAULT 0,
  isFeatured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Funding Opportunities Table
CREATE TABLE IF NOT EXISTS public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  logo TEXT,
  amount TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Workshops Table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  host TEXT NOT NULL,
  logo TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER,
  registered INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Discussions Table
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT NOT NULL,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  resume_url TEXT,
  cover_letter TEXT,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Course Enrollments Table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'enrolled',
  progress INTEGER DEFAULT 0,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Funding Applications Table
CREATE TABLE IF NOT EXISTS public.funding_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  proposal_url TEXT,
  additional_info TEXT,
  funding_id UUID REFERENCES public.funding_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Workshop Registrations Table
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'registered',
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);`}
                      </pre>
                      <Button
                        className="absolute top-2 right-2"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(document.querySelector("pre")?.textContent || "")
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure user roles and permissions for your platform.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Settings</CardTitle>
              <CardDescription>Configure access control</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up permissions and access control for different user roles.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

