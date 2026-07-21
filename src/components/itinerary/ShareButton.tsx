"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing more we can do silently.
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} className={className}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" aria-hidden="true" />
          Link copied
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Copy link
        </>
      )}
    </Button>
  );
}
