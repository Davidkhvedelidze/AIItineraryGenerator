import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/components/blog/blog.module.css";

export default function BlogLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        aria-busy="true"
        aria-label="Loading travel stories"
        className={`flex-1 ${styles.journal}`}
      >
        <div className="container max-w-6xl space-y-12 py-10 sm:py-14">
          <div className="max-w-3xl space-y-5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-16 w-full max-w-xl" />
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>
          <div className="grid overflow-hidden rounded-2xl md:grid-cols-2">
            <Skeleton className="min-h-64 md:min-h-[420px]" />
            <div className={`space-y-5 p-8 ${styles.soft}`}>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-11 w-full" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
