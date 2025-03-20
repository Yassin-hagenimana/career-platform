"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-Supabase"
import { MemberCard } from "./member-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from "lucide-react"

type Member = {
  id: string
  created_at: string
  email: string
  full_name: string
  avatar_url: string
  title: string
  company: string
  bio: string
  skills: string[] | string | null
  location: string
}

export function MembersDirectory() {
  const { supabase } = useSupabase()
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [availableLocations, setAvailableLocations] = useState<string[]>([])

  // Parse skills to ensure we have an array
  const parseSkills = (skills: string[] | string | null): string[] => {
    if (!skills) return []

    // If skills is already an array
    if (Array.isArray(skills)) {
      return skills
    }

    // If skills is a string, try to parse it as JSON
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        // If it's not valid JSON, split by comma
        return skills.split(",").map((skill) => skill.trim())
      }
    }

    return []
  }

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching members:", error)
          return
        }

        const membersData = data as Member[]
        setMembers(membersData)
        setFilteredMembers(membersData)

        // Extract unique skills and locations for filters
        const skills = new Set<string>()
        const locations = new Set<string>()

        membersData.forEach((member) => {
          const memberSkills = parseSkills(member.skills)
          memberSkills.forEach((skill) => skills.add(skill))

          if (member.location) {
            locations.add(member.location)
          }
        })

        setAvailableSkills(Array.from(skills))
        setAvailableLocations(Array.from(locations))
      } catch (error) {
        console.error("Error in fetchMembers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [supabase])

  useEffect(() => {
    // Apply filters and search
    let result = members

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (member) =>
          member.full_name?.toLowerCase().includes(query) ||
          member.title?.toLowerCase().includes(query) ||
          member.company?.toLowerCase().includes(query) ||
          member.bio?.toLowerCase().includes(query),
      )
    }

    // Apply skill filter
    if (skillFilter !== "all") {
      result = result.filter((member) => {
        const memberSkills = parseSkills(member.skills)
        return memberSkills.includes(skillFilter)
      })
    }

    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter((member) => member.location === locationFilter)
    }

    setFilteredMembers(result)
  }, [members, searchQuery, skillFilter, locationFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members by name, title, or company..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {availableLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </div>
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium">No members found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSkillFilter("all")
                  setLocationFilter("all")
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

