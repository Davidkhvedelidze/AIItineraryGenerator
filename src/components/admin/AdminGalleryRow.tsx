"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PendingGallerySubmission } from "@/lib/supabase/itineraryRequests";

export function AdminGalleryRow({ submission }: { submission: PendingGallerySubmission }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/gallery/${submission.shortId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to update this submission.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to update this submission.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-serif text-lg font-semibold text-foreground">
          {submission.shareTitle || submission.tripTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {submission.tripLength} days · submitted{" "}
          {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "—"}
        </p>
        {error ? <p className="mt-1 text-sm font-medium text-red-600">{error}</p> : null}
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`/itinerary/${submission.shortId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline underline-offset-2"
        >
          Preview
        </a>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleAction("reject")}
        >
          Reject
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isSubmitting}
          onClick={() => handleAction("approve")}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}
