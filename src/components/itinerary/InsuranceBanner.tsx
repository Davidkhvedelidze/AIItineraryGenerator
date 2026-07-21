import { ShieldCheck } from "lucide-react";
import { INSURANCE_AFFILIATE_LINK } from "@/lib/affiliate-config";

export function InsuranceBanner() {
  return (
    <div className="border-y border-stone-200 bg-muted/50">
      <div className="container py-8">
        <a
          href={INSURANCE_AFFILIATE_LINK.url}
          target="_blank"
          rel="sponsored noopener"
          className="mx-auto flex max-w-2xl items-center gap-4 text-left transition hover:opacity-80"
        >
          <ShieldCheck className="h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
          <p className="text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">{INSURANCE_AFFILIATE_LINK.label}. </span>
            {INSURANCE_AFFILIATE_LINK.description}
          </p>
        </a>
      </div>
    </div>
  );
}
