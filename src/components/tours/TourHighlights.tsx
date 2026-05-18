import { CheckCircle2, Sparkles } from "lucide-react";

type TourHighlightsProps = {
  highlights?: string[];
};

export function TourHighlights({ highlights }: TourHighlightsProps) {
  const items = highlights?.filter(Boolean) ?? [];
  if (items.length === 0) return null;

  return (
    <section id="highlights" className="scroll-mt-24 space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Why travelers choose it
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Highlights</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <article
            key={`${item}-${index}`}
            className="flex gap-3 rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary">
              {index === 0 ? (
                <Sparkles className="h-4 w-4 text-amber-700" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-amber-700" aria-hidden="true" />
              )}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
