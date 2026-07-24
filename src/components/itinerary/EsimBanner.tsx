import { ArrowRight, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ESIM_AFFILIATE_LINK } from "@/lib/affiliate-config";

export function EsimBanner() {
  return (
    <a
      href={ESIM_AFFILIATE_LINK.url}
      target="_blank"
      rel="sponsored noopener"
      className="group flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 ring-4 ring-sky-50">
        <Wifi className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="flex-1">
        <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
          Stay connected
        </span>
        <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-foreground">
          {ESIM_AFFILIATE_LINK.label}
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {ESIM_AFFILIATE_LINK.description}
        </p>
      </div>

      <Button
        type="button"
        className="mt-auto w-full gap-2 bg-sky-600 text-white hover:bg-sky-700"
        tabIndex={-1}
      >
        Get my eSIM
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Button>
    </a>
  );
}
