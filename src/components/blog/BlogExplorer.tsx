"use client";

import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import styles from "./blog.module.css";

type BlogExplorerProps = {
  items: {
    id: string;
    category: string;
    searchText: string;
    card: ReactNode;
  }[];
};

export function BlogExplorer({ items }: BlogExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean)),
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleItems = items.filter(
    (item) =>
      (!category || item.category === category) &&
      item.searchText.includes(normalizedQuery),
  );
  const hasFilters = Boolean(normalizedQuery || category);

  function clearFilters() {
    setQuery("");
    setCategory(null);
  }

  return (
    <section
      id="travel-guides"
      aria-labelledby="travel-guides-heading"
      className="scroll-mt-24"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="travel-guides-heading"
            className="font-serif text-3xl font-medium sm:text-4xl"
          >
            Explore the guides
          </h2>
          <p className={`mt-2 text-sm ${styles.muted}`}>
            A little local knowledge goes a long way.
          </p>
        </div>
        <div role="search" className="relative w-full sm:max-w-xs">
          <label htmlFor="blog-search" className="sr-only">
            Search travel guides
          </label>
          <Search
            aria-hidden="true"
            className={`pointer-events-none absolute left-4 top-4 h-4 w-4 ${styles.muted}`}
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search places, tips, and stories"
            className={`${styles.search} [&::-webkit-search-cancel-button]:appearance-none`}
            aria-controls="blog-results"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className={`absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full ${styles.accent}`}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label="Filter guides by topic"
          className="mt-6 flex flex-wrap gap-2"
        >
          <button
            type="button"
            className={styles.filter}
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
          >
            All stories
          </button>
          {categories.map((topic) => (
            <button
              key={topic}
              type="button"
              className={styles.filter}
              aria-pressed={category === topic}
              onClick={() => setCategory(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      ) : null}
      <div
        className={`mb-7 mt-6 flex min-h-8 items-center justify-between gap-4 border-t pt-5 text-sm ${styles.border} ${styles.muted}`}
      >
        <p role="status" aria-live="polite" aria-atomic="true">
          {visibleItems.length}{" "}
          {visibleItems.length === 1 ? "story" : "stories"}
          {category ? ` in ${category}` : " to inspire your trip"}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className={`min-h-11 shrink-0 font-semibold underline underline-offset-4 ${styles.accent}`}
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <div id="blog-results">
        {visibleItems.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <div key={item.id} className="min-w-0">
                {item.card}
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl px-6 py-14 text-center ${styles.soft}`}>
            <Search
              aria-hidden="true"
              className={`mx-auto mb-4 h-7 w-7 ${styles.accent}`}
            />
            <h3 className="font-serif text-2xl">No matching guides</h3>
            <p
              className={`mx-auto mt-3 max-w-md text-sm leading-6 ${styles.muted}`}
            >
              Try another place or topic, or clear your filters to explore all
              our Georgia travel stories.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className={`mt-6 ${styles.primaryButton}`}
            >
              Show all stories
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
