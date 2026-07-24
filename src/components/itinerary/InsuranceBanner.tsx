import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSURANCE_AFFILIATE_LINK } from "@/lib/affiliate-config";

const INSURANCE_WIDGET_SRC =
  "https://tpemb.com/content?trs=552780&shmarker=753662&type=visitor&theme=large-theme1&powered_by=true&campaign_id=153&promo_id=4652";

export function InsuranceBanner() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm justify-between">
      <a
        href={INSURANCE_AFFILIATE_LINK.url}
        target="_blank"
        rel="sponsored noopener"
        className="group flex h-full flex-col gap-4 text-left transition"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </span>

        <div className="flex-1">
          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            Stay protected
          </span>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-foreground">
            {INSURANCE_AFFILIATE_LINK.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {INSURANCE_AFFILIATE_LINK.description}
          </p>
        </div>

        <Button
          type="button"
          className="mt-auto w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          tabIndex={-1}
        >
          Compare plans
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      </a>

      <div
        dangerouslySetInnerHTML={{
          __html: `<script async src="${INSURANCE_WIDGET_SRC}" charset="utf-8"></script>`,
        }}
      />
    </div>
  );
}
