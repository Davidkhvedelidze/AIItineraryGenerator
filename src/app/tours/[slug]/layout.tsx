import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/tours";

export default async function TourLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const tour = await getTourBySlug(params.slug);

  // Check outside this segment's loading boundary, before a 200 is streamed.
  // Keep the listing's loading boundary in (listing), not above this layout.
  if (!tour) notFound();

  return children;
}
