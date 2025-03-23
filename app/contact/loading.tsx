import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ContactLoading() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="mt-4 h-20 w-full" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
