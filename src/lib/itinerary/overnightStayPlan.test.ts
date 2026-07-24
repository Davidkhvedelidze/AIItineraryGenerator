import { describe, expect, it } from "vitest";
import { buildOvernightStayPlan, buildOvernightStayPlanFromAi } from "./overnightStayPlan";

describe("buildOvernightStayPlan", () => {
  it("a 3-day trip staying in the same city: only day 1 shows, covering 3 nights", () => {
    const plan = buildOvernightStayPlan([
      { day: 1, region: "Tbilisi" },
      { day: 2, region: "Tbilisi" },
      { day: 3, region: "Tbilisi" },
    ]);

    expect(plan.get(1)).toBe(3);
    expect(plan.has(2)).toBe(false);
    expect(plan.has(3)).toBe(false);
  });

  it("a trip that changes city mid-way: each city's stay starts its own run", () => {
    const plan = buildOvernightStayPlan([
      { day: 1, region: "Tbilisi" },
      { day: 2, region: "Tbilisi" },
      { day: 3, region: "Kazbegi region" },
      { day: 4, region: "Tbilisi" },
      { day: 5, region: "Tbilisi" },
    ]);

    expect(plan.get(1)).toBe(2);
    expect(plan.has(2)).toBe(false);
    expect(plan.get(3)).toBe(1);
    expect(plan.get(4)).toBe(2);
    expect(plan.has(5)).toBe(false);
  });

  it("regions without a known accommodation city (e.g. Mtskheta day trips) never appear in the plan", () => {
    const plan = buildOvernightStayPlan([
      { day: 1, region: "Tbilisi" },
      { day: 2, region: "Mtskheta" },
      { day: 3, region: "Tbilisi" },
    ]);

    expect(plan.get(1)).toBe(1);
    expect(plan.has(2)).toBe(false);
    expect(plan.get(3)).toBe(1);
  });

  it("returns an empty plan for an empty itinerary", () => {
    expect(buildOvernightStayPlan([]).size).toBe(0);
  });
});

describe("buildOvernightStayPlanFromAi", () => {
  it("a single stay for the whole trip: nights run to the end of the trip", () => {
    const plan = buildOvernightStayPlanFromAi([{ day: 1, city: "Tbilisi" }], 3);

    expect(plan.get(1)).toBe(3);
  });

  it("a stay that changes city mid-trip: nights run up to the next stay's start day", () => {
    const plan = buildOvernightStayPlanFromAi(
      [
        { day: 1, city: "Tbilisi" },
        { day: 4, city: "Kazbegi" },
      ],
      5,
    );

    expect(plan.get(1)).toBe(3);
    expect(plan.get(4)).toBe(2);
  });

  it("sorts out-of-order entries by day before computing nights", () => {
    const plan = buildOvernightStayPlanFromAi(
      [
        { day: 4, city: "Kazbegi" },
        { day: 1, city: "Tbilisi" },
      ],
      5,
    );

    expect(plan.get(1)).toBe(3);
    expect(plan.get(4)).toBe(2);
  });

  it("returns an empty plan when the AI provided no stays", () => {
    expect(buildOvernightStayPlanFromAi([], 5).size).toBe(0);
  });
});
