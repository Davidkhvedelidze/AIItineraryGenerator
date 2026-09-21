import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/components/blog/blog.module.css";

export default function BlogPostLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        aria-busy="true"
        aria-label="Loading travel guide"
        className={`flex-1 ${styles.journal}`}
      >
        <div className="container max-w-6xl space-y-8 py-10">
          <Skeleton className="h-5 w-36" />
          <div className="max-w-4xl space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-16 w-full max-w-3xl" />
            <Skeleton className="h-5 w-60" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:aspect-[2/1]" />
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
