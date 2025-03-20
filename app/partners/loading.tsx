import { Skeleton } from "@/components/ui/skeleton"

export default function PartnersLoading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Skeleton className="h-10 w-32 mb-8" />

      <div className="space-y-8 mb-12">
        <div>
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-24 w-full max-w-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-9 w-32" />
              </div>
            ))}
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

