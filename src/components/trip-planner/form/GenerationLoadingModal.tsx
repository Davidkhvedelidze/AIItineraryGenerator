"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

interface GenerationLoadingModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function GenerationLoadingModal({ isOpen, onCancel }: GenerationLoadingModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    return () => {
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute("disabled"),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm" role="presentation">
      <motion.div
        ref={dialogRef}
        aria-describedby="trip-generation-modal-description"
        aria-labelledby="trip-generation-modal-title"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-md rounded-2xl border border-amber-100 bg-card p-6 text-center shadow-2xl shadow-yellow-900/20"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-stone-900">
          <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
        <h3 id="trip-generation-modal-title" className="text-lg font-semibold">
          Generating your trip plan
        </h3>
        <p
          id="trip-generation-modal-description"
          className="mt-2 text-sm leading-6 text-muted-foreground"
          aria-live="polite"
        >
          This can take a few minutes while we build a realistic itinerary from your travel dates, interests, and
          preferences. Please keep this page open.
        </p>
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={onCancel}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-foreground transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
