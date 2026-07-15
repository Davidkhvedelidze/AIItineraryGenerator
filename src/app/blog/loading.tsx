import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-4">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full max-w-md" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                <Skeleton className="h-40 w-full rounded-md" />
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
