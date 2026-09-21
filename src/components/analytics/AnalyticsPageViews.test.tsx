import { StrictMode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AnalyticsPageViews } from "./AnalyticsPageViews";

const route = vi.hoisted(() => ({ path: "/", query: "email=private@example.com" }));
vi.mock("next/navigation", () => ({
  usePathname: () => route.path,
  useSearchParams: () => new URLSearchParams(route.query),
}));
afterEach(() => { cleanup(); delete window.gtag; });

it("waits for initialization, deduplicates effects, and tracks route/query/back navigation without sensitive URLs", () => {
  const gtag = vi.fn();
  window.gtag = gtag;
  const view = render(<StrictMode><AnalyticsPageViews ready={false} /></StrictMode>);
  expect(window.gtag).not.toHaveBeenCalled();
  const rerender = () => view.rerender(<StrictMode><AnalyticsPageViews ready /></StrictMode>);
  rerender();
  rerender();
  route.path = "/tours"; rerender();
  route.query = "phone=1234"; rerender();
  route.path = "/"; rerender();
  const events = gtag.mock.calls.filter(([command]) => command === "event");
  expect(events).toHaveLength(4);
  expect(JSON.stringify(events)).not.toMatch(/private@example|phone=|1234|email=/);
});
