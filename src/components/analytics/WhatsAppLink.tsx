"use client";

import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<"a">, "onClick" | "onAuxClick"> & {
  clickLocation: "floating_button" | "header" | "tour_detail" | "home_cta" | "tours_page";
};

export function WhatsAppLink({ clickLocation, ...props }: Props) {
  const trackClick = () => trackEvent("whatsapp_click", { click_location: clickLocation });
  return <a {...props} onClick={trackClick} onAuxClick={(event) => {
    if (event.button === 1) trackClick();
  }} />;
}
