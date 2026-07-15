"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function BlogPostError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load this article"
      description="We couldn't load this blog post right now. Please try again in a moment."
      reset={reset}
    />
  );
}
