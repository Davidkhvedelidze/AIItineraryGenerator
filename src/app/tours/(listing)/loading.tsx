import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToursLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="max-w-4xl space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full max-w-xl" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-3/4 max-w-2xl" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                <Skeleton className="h-44 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
