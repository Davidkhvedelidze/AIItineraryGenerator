import dayjs from "dayjs";

export const defaultArrivalDate = dayjs().add(14, "day").hour(10).minute(0).second(0).millisecond(0);
export const defaultDepartureDate = defaultArrivalDate.add(5, "day").hour(18).minute(0).second(0).millisecond(0);
export const defaultTravelDates: [string, string] = [
  defaultArrivalDate.toISOString(),
  defaultDepartureDate.toISOString(),
];

export function calculateTripLength(travelDates?: [string, string]) {
  if (!travelDates?.[0] || !travelDates?.[1]) return { days: null, nights: null };

  const arrivalDate = dayjs(travelDates[0]);
  const departureDate = dayjs(travelDates[1]);

  if (!arrivalDate.isValid() || !departureDate.isValid() || !departureDate.isAfter(arrivalDate)) {
    return { days: null, nights: null };
  }

  const nights = Math.max(0, departureDate.startOf("day").diff(arrivalDate.startOf("day"), "day"));
  return { days: nights + 1, nights };
}
