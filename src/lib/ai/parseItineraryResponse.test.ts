import { describe, expect, it } from "vitest";
import { parseItineraryResponse } from "./parseItineraryResponse";

describe("parseItineraryResponse", () => {
  it("parses plain JSON", () => {
    const result = parseItineraryResponse('{"tripTitle":"Trip","days":[]}');

    expect(result.tripTitle).toBe("Trip");
  });

  it("strips fenced code blocks before parsing", () => {
    const result = parseItineraryResponse('```json\n{"tripTitle":"Trip","days":[]}\n```');

    expect(result.tripTitle).toBe("Trip");
  });

  it("throws a clean error for non-JSON input instead of crashing", () => {
    expect(() => parseItineraryResponse("not json at all")).toThrow("Unable to parse itinerary response.");
  });

  it("throws a clean error when the parsed value has no days array", () => {
    expect(() => parseItineraryResponse('{"tripTitle":"Trip"}')).toThrow("Unable to parse itinerary response.");
  });

  it("throws a clean error for a JSON array instead of an object", () => {
    expect(() => parseItineraryResponse("[1,2,3]")).toThrow("Unable to parse itinerary response.");
  });
});
