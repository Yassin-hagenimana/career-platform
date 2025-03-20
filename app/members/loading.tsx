import { Skeleton } from "@/components/ui/skeleton"

export default function MembersLoading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-10 w-[300px] mb-6" />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <Skeleton className="h-10 w-full md:w-[400px]" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

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
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-9 w-[48%]" />
              <Skeleton className="h-9 w-[48%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

