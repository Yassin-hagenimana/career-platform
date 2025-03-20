import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CourseLoading() {
  return (
    <div className="container py-10">
      <div className="flex items-center text-sm mb-6">
        <Skeleton className="h-4 w-4 mr-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex items-center mt-2 space-x-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-64 w-full mb-6 rounded-lg" />

          <div className="mb-8">
            <Skeleton className="h-7 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="py-3">
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent className="py-2">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

