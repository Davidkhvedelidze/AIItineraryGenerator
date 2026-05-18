import { defineField, defineType } from "sanity";

export const tour = defineType({
  name: "tour",
  title: "Tour",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({
      name: "startingLocation",
      title: "Starting Location",
      type: "string",
    }),
    defineField({
      name: "endingLocation",
      title: "Ending Location",
      type: "string",
    }),
    defineField({ name: "tourType", title: "Tour Type", type: "string" }),
    defineField({ name: "groupType", title: "Group Type", type: "string" }),
    defineField({
      name: "customizable",
      title: "Customizable",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "priceFrom",
      title: "Price From",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "pricingTiers",
      title: "Pricing Tiers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({ name: "currency", title: "Currency", type: "string" }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
          ],
          preview: {
            select: {
              title: "label",
              price: "price",
              currency: "currency",
            },
            prepare({ title, price, currency }) {
              return {
                title: title || "Pricing tier",
                subtitle:
                  price !== undefined ? [price, currency].filter(Boolean).join(" ") : undefined,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
    }),
    defineField({ name: "priceNote", title: "Price Note", type: "string" }),
    defineField({
      name: "tripadvisorUrl",
      title: "TripAdvisor URL",
      type: "url",
    }),
    defineField({
      name: "directBookingEnabled",
      title: "Direct Booking Enabled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Cancellation Policy",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "bookingCutoff", title: "Booking Cutoff", type: "string" }),
    defineField({ name: "confirmationMethod", title: "Confirmation Method", type: "string" }),
    defineField({
      name: "maxTravelers",
      title: "Max Travelers",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "ageGroups",
      title: "Age Groups",
      type: "array",
      initialValue: [
        {
          label: "Infant",
          range: "0-5",
          note: "Infants must sit on laps. Infant seats are available on request.",
        },
        {
          label: "Child",
          range: "0-5",
          note: "Child pricing is available in the product pricing schedule.",
        },
        {
          label: "Youth",
          range: "0-5",
          note: "Youth pricing is available in the product pricing schedule.",
        },
        {
          label: "Adult",
          range: "2-15 travelers",
          note: "Adult private group pricing depends on total group size.",
        },
      ],
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "range", title: "Range", type: "string" }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "range",
            },
          },
        },
      ],
    }),
    defineField({
      name: "requiredTravelerInfo",
      title: "Required Traveler Info",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "operatingDays",
      title: "Operating Days",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "operatorCancellationRights",
      title: "Operator Cancellation Rights",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bookingNotificationNote",
      title: "Booking Notification Note",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "guideLanguage", title: "Guide Language", type: "string" }),
    defineField({ name: "guideNote", title: "Guide Note", type: "text", rows: 3 }),
    defineField({ name: "audioGuide", title: "Audio Guide", type: "string" }),
    defineField({ name: "writtenGuide", title: "Written Guide", type: "string" }),
    defineField({ name: "difficultyLevel", title: "Difficulty Level", type: "string" }),
    defineField({ name: "airport", title: "Airport", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact Phone", type: "string" }),
    defineField({ name: "listingName", title: "Listing Name", type: "string" }),
    defineField({ name: "listingLocation", title: "Listing Location", type: "string" }),
    defineField({
      name: "directBookingCtaTitle",
      title: "Direct Booking CTA Title",
      type: "string",
    }),
    defineField({
      name: "directBookingCtaText",
      title: "Direct Booking CTA Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tripadvisorCtaTitle",
      title: "TripAdvisor CTA Title",
      type: "string",
    }),
    defineField({
      name: "tripadvisorCtaText",
      title: "TripAdvisor CTA Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pickupInfo",
      title: "Pickup Info",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pickupLocations",
      title: "Pickup Locations",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "departureTimes",
      title: "Departure Times",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "regions",
      title: "Regions",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "day", title: "Day", type: "number" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "region", title: "Region", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "stops",
              title: "Stops",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "mealsIncluded",
              title: "Meals Included",
              type: "boolean",
            }),
            defineField({
              name: "accommodationIncluded",
              title: "Accommodation Included",
              type: "boolean",
            }),
          ],
          preview: {
            select: {
              day: "day",
              title: "title",
              subtitle: "region",
            },
            prepare({ day, title, subtitle }) {
              return {
                title: day ? `Day ${day}: ${title || "Untitled"}` : title,
                subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "included",
      title: "Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "notIncluded",
      title: "Not Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "importantNotes",
      title: "Important Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "accessibilityNotes",
      title: "Accessibility Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "healthNotes",
      title: "Health Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
          },
        },
      ],
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "reviewerName",
              title: "Reviewer Name",
              type: "string",
            }),
            defineField({ name: "country", title: "Country", type: "string" }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule) => Rule.min(1).max(5),
            }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
            defineField({ name: "source", title: "Source", type: "string" }),
            defineField({
              name: "reviewDate",
              title: "Review Date",
              type: "date",
            }),
          ],
          preview: {
            select: {
              title: "reviewerName",
              subtitle: "source",
            },
          },
        },
      ],
    }),
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      duration: "duration",
      startingLocation: "startingLocation",
      media: "mainImage",
    },
    prepare({ title, duration, startingLocation, media }) {
      return {
        title,
        subtitle: [duration, startingLocation].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
