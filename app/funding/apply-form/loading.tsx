import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex items-center mb-8">
        <Skeleton className="h-10 w-10 rounded-md mr-2" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-12 w-full mb-8" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>

          <Skeleton className="h-12 w-32 ml-auto" />
        </div>
      </div>
    </div>
  )
}

