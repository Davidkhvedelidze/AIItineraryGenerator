import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "@/components/blog/blog.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/** Visual breadcrumb; the last item is the current page. */
export function DestinationBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-8 text-sm ${styles.muted}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`inline-flex min-h-11 items-center font-medium ${styles.accent} hover:underline`}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="truncate">
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
