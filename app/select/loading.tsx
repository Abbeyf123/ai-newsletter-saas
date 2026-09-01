import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PreferencesSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Skeleton className="mb-6 h-8 w-36" />

        <div className="mb-8 space-y-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-10 w-[520px] max-w-full" />
          <Skeleton className="h-5 w-[440px] max-w-full" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </CardHeader>

              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-xl" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </CardHeader>

              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-xl" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
