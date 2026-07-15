"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      title="Unable to load the blog"
      description="We couldn't load travel guides right now. Please try again in a moment."
      reset={reset}
    />
  );
}
