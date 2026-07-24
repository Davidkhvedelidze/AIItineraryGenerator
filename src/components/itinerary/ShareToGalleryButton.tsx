"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SharingStatus } from "@/lib/supabase/itineraryRequests";

type ShareToGalleryButtonProps = {
  shortId: string;
  suggestedTitle: string;
  initialSharingStatus: SharingStatus;
};

export function ShareToGalleryButton({
  shortId,
  suggestedTitle,
  initialSharingStatus,
}: ShareToGalleryButtonProps) {
  const [sharingStatus, setSharingStatus] = useState(initialSharingStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(suggestedTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/itinerary/${shortId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to submit right now. Please try again.");
        return;
      }

      setSharingStatus("pending");
      setIsOpen(false);
    } catch {
      setError("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sharingStatus === "approved") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
        <Check className="h-4 w-4" aria-hidden="true" />
        Live in the community gallery
      </span>
    );
  }

  if (sharingStatus === "pending") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
        <Loader2 className="h-4 w-4" aria-hidden="true" />
        Submitted — pending review
      </span>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Share to public gallery
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Share this trip idea
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label htmlFor="gallery-title">Trip title</Label>
              <Input
                id="gallery-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Your name, email, and phone number are never shown. A moderator reviews
              submissions before they appear in the public gallery.
            </p>

            {error ? (
              <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting || title.trim().length < 3}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting…" : "Submit for review"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
