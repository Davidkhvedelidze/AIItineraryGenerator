import styles from "./blog.module.css";

type BlogTableOfContentsProps = {
  headings: { id: string; text: string }[];
};

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  if (headings.length < 2) return null;
  const links = headings.map((heading) => (
    <li key={heading.id}>
      <a href={`#${heading.id}`} className={styles.tocLink}>
        {heading.text}
      </a>
    </li>
  ));

  return (
    <aside className="min-w-0 lg:col-start-2 lg:row-start-1">
      <details className={`rounded-2xl border p-5 lg:hidden ${styles.border}`}>
        <summary className={`cursor-pointer font-semibold ${styles.accent}`}>
          In this guide
        </summary>
        <nav aria-label="Table of contents" className="mt-4">
          <ol className="space-y-1">{links}</ol>
        </nav>
      </details>
      <nav
        aria-label="Table of contents"
        className="sticky top-24 hidden lg:block"
      >
        <h2 className={`mb-5 text-sm font-semibold ${styles.accent}`}>
          In this guide
        </h2>
        <ol className="max-h-[calc(100dvh-10rem)] space-y-1 overflow-y-auto py-1 pr-3">
          {links}
        </ol>
      </nav>
    </aside>
  );
}
