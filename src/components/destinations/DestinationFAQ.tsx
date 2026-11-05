import { ChevronDown } from "lucide-react";
import styles from "@/components/blog/blog.module.css";

export type DestinationFAQEntry = {
  key: string;
  question: string;
  answer: string;
};

/** Native <details> accordion: answers are in the server HTML, no JS needed to reveal them. */
export function DestinationFAQ({ items }: { items: DestinationFAQEntry[] }) {
  return (
    <div className={`divide-y rounded-2xl border ${styles.border}`}>
      {items.map((item) => (
        <details key={item.key} className={`group ${styles.border}`}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 transition-transform group-open:rotate-180 ${styles.accent}`}
              aria-hidden="true"
            />
          </summary>
          <p className={`whitespace-pre-line px-5 pb-5 text-sm leading-7 ${styles.muted}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
