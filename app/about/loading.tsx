import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Skeleton className="h-10 w-32 mb-8" />

      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <Skeleton className="h-[300px] lg:h-[400px] rounded-lg" />
        </div>
      </section>

      {/* About Tabs */}
      <section className="mb-16">
        <div className="space-y-8">
          <Skeleton className="h-12 w-full rounded-lg" />

          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-[250px] rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-64 w-64 mx-auto rounded-full mb-4" />
              <Skeleton className="h-6 w-40 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

