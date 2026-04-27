"use client";

import { memo } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onReset: () => void;
}

function ErrorMessageComponent({ message, onReset }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4" aria-live="polite">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
        <div>
          <p className="font-medium text-destructive">We couldn&apos;t generate your itinerary.</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={onReset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}

export const ErrorMessage = memo(ErrorMessageComponent);
