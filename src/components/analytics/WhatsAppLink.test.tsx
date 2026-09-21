import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WhatsAppLink } from "./WhatsAppLink";

afterEach(() => { cleanup(); delete window.gtag; });
it("tracks clicks, including middle clicks, without sending the destination or message", () => {
  window.gtag = vi.fn();
  render(<WhatsAppLink href="#private-message" clickLocation="header">Help</WhatsAppLink>);
  expect(window.gtag).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("link"));
  expect(window.gtag).toHaveBeenCalledTimes(1);
  expect(window.gtag).toHaveBeenCalledWith("event", "whatsapp_click", { click_location: "header" });
  fireEvent(screen.getByRole("link"), new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  expect(window.gtag).toHaveBeenCalledTimes(2);
});
