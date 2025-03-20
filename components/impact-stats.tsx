import { Users, GraduationCap, Briefcase, Building } from "lucide-react"

export default function ImpactStats() {
  return (
    <div className="container mx-auto">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Our Impact</h2>
        <p className="text-lg text-muted-foreground">
          Making a difference in the lives of African youth through skills, opportunities, and connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-4xl font-bold">25,000+</h3>
          <p className="text-muted-foreground">Active Users</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-4xl font-bold">150+</h3>
          <p className="text-muted-foreground">Career Courses</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-4xl font-bold">8,500+</h3>
          <p className="text-muted-foreground">Job Placements</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-4xl font-bold">500+</h3>
          <p className="text-muted-foreground">Funded Startups</p>
        </div>
      </div>
    </div>
  )
}

