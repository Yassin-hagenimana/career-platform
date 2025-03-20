import type { Metadata } from "next"
import { MembersDirectory } from "@/components/members/members-directory"

export const metadata: Metadata = {
  title: "Members Directory | CareerEmpowers",
  description: "Browse and connect with members of the CareerEmpowers community",
}

export default function MembersPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Members Directory</h1>
      <MembersDirectory />
    </div>
  )
}

