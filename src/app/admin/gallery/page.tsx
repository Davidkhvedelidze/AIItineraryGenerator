import type { Metadata } from "next";
import { AdminGalleryRow } from "@/components/admin/AdminGalleryRow";
import { isAdminAuthorized } from "@/lib/admin/adminAuth";
import { listPendingGallerySubmissions } from "@/lib/supabase/itineraryRequests";

export const metadata: Metadata = {
  title: "Gallery moderation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function AdminLoginForm({ hasError }: { hasError: boolean }) {
  return (
    <div className="mx-auto mt-24 max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-serif text-xl font-semibold text-foreground">Admin sign-in</h1>
      <form method="POST" action="/api/admin/login" className="mt-4 space-y-3">
        <input type="hidden" name="redirectTo" value="/admin/gallery" />
        <input
          type="password"
          name="secret"
          placeholder="Admin secret"
          required
          autoFocus
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {hasError ? (
          <p className="text-sm font-medium text-red-600">Incorrect secret. Try again.</p>
        ) : null}
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (!isAdminAuthorized()) {
    return <AdminLoginForm hasError={searchParams.error === "1"} />;
  }

  const submissions = await listPendingGallerySubmissions();

  return (
    <div className="container py-12">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Pending gallery submissions
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {submissions.length} awaiting review.
      </p>

      <div className="mt-6 space-y-3">
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing pending right now.</p>
        ) : (
          submissions.map((submission) => (
            <AdminGalleryRow key={submission.shortId} submission={submission} />
          ))
        )}
      </div>
    </div>
  );
}
