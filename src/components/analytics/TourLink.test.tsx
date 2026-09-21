import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TourLink } from "./TourLink";

afterEach(() => { cleanup(); delete window.gtag; });
it.each(["tour_card", "itinerary_recommendation"] as const)("tracks only user clicks from %s", (location) => {
  window.gtag = vi.fn();
  render(<TourLink tourSlug="kazbegi" clickLocation={location}>View tour</TourLink>);
  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/tours/kazbegi");
  expect(window.gtag).not.toHaveBeenCalled();
  // jsdom cannot navigate; cancel its default action without suppressing the click handler.
  link.addEventListener("click", (event) => event.preventDefault());
  fireEvent.click(link, { ctrlKey: true });
  expect(window.gtag).toHaveBeenCalledTimes(1);
  expect(window.gtag).toHaveBeenCalledWith("event", "tour_click", { tour_slug: "kazbegi", click_location: location });
});
