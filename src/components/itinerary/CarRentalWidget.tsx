import { ArrowRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAR_RENTAL_AFFILIATE_LINK } from "@/lib/affiliate-config";

const CAR_RENTAL_WIDGET_SRC =
  "https://tpemb.com/content?trs=552780&shmarker=753662&locale=en&powered_by=true&bg_color=%23fad130&font_color=%23333333&button_color=%2300a200&button_font_color=%23ffffff&button_text=Search&rounded_corners=false&benefits=false&dc_powered_by=false&supplier_logos=false&campaign_id=117&promo_id=3873";

export function CarRentalWidget() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-6 shadow-sm ">
      <a
        href={CAR_RENTAL_AFFILIATE_LINK.url}
        target="_blank"
        rel="sponsored noopener"
        className="group flex h-full flex-col gap-4 justify-between  text-left transition"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-4 ring-amber-50">
          <Car className="h-7 w-7" aria-hidden="true" />
        </span>

        <div className="flex-1">
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
            Get around Georgia
          </span>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-foreground">
            {CAR_RENTAL_AFFILIATE_LINK.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {CAR_RENTAL_AFFILIATE_LINK.description}
          </p>
        </div>

        <Button
          type="button"
          className="mt-auto w-full gap-2 bg-amber-600 text-white hover:bg-amber-700"
          tabIndex={-1}
        >
          Find a rental car
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      </a>

      <div
        dangerouslySetInnerHTML={{
          __html: `<script async src="${CAR_RENTAL_WIDGET_SRC}" charset="utf-8"></script>`,
        }}
      />
    </div>
  );
}
