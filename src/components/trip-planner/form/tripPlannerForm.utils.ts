import dayjs from "dayjs";

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
