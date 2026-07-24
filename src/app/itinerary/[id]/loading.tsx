import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItineraryLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Skeleton className="h-72 w-full sm:h-96" />
        <div className="container py-6">
          <Skeleton className="mx-auto h-20 w-full max-w-3xl rounded-2xl" />
        </div>
        <div className="container space-y-6 py-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
