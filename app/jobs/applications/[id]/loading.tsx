import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function JobApplicationDetailsLoading() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Skeleton className="h-10 w-40 mb-6" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>

            <Separator />

            <div>
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <div>
              <Skeleton className="h-6 w-40 mb-3" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

