import { defineArrayMember, defineField, defineType } from "sanity";

type ImageWithAsset = { asset?: { _ref?: string } } | undefined;

/** Alt text is required whenever an image asset is set. */
const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the image for screen readers and search engines.",
  validation: (Rule) =>
    Rule.custom((alt, context) => {
      const parent = context.parent as ImageWithAsset;
      if (parent?.asset?._ref && !alt?.trim()) return "Alt text is required.";
      return true;
    }),
});

const linkAnnotation = defineArrayMember({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});

const destinationTypes = [
  { title: "Region", value: "region" },
  { title: "City", value: "city" },
  { title: "Area", value: "area" },
];

export const destination = defineType({
  name: "destination",
  title: "Destination",
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
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isLive",
      title: "Is live",
      type: "boolean",
      description:
        "Only live destinations are rendered, listed and included in the sitemap. Off = 404.",
      initialValue: false,
    }),
    defineField({
      name: "destinationType",
      title: "Destination type",
      type: "string",
      options: { list: destinationTypes, layout: "radio", direction: "horizontal" },
      initialValue: "region",
    }),
    defineField({
      name: "parent",
      title: "Parent destination",
      type: "reference",
      to: [{ type: "destination" }],
      description: "Optional. E.g. a city page that belongs to a region.",
      options: {
        filter: ({ document }) => ({
          filter: "_id != $id && _id != $draftId",
          params: {
            id: document._id.replace(/^drafts\./, ""),
            draftId: `drafts.${document._id.replace(/^drafts\./, "")}`,
          },
        }),
      },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Sort order on /destinations (lowest first).",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Card text and fallback meta description.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (Rule) => Rule.max(60).warning("Keep the meta title under 60 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("Keep the meta description under 160 characters."),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      description: "Answer-first intro paragraph(s).",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: { annotations: [linkAnnotation] },
        }),
      ],
    }),
    defineField({
      name: "quickFacts",
      title: "Quick facts",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "distanceFromTbilisiKm",
          title: "Distance from Tbilisi (km)",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "driveTimeFromTbilisi",
          title: "Drive time from Tbilisi",
          type: "string",
        }),
        defineField({ name: "bestTimeToVisit", title: "Best time to visit", type: "string" }),
        defineField({ name: "daysNeeded", title: "Days needed", type: "string" }),
        defineField({ name: "nearestAirport", title: "Nearest airport", type: "string" }),
        defineField({ name: "gettingThere", title: "Getting there", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "\"Top things to see\" cards.",
      type: "array",
      of: [
        defineArrayMember({
          name: "highlight",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [altField],
            }),
            defineField({
              name: "post",
              title: "Linked blog post",
              type: "reference",
              to: [{ type: "blogPost" }],
            }),
            defineField({
              name: "url",
              title: "Fallback URL",
              type: "string",
              description: "Used when no blog post is linked. Internal (/tours/…) or external.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "description", media: "image" },
          },
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: { annotations: [linkAnnotation] },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [altField],
        }),
      ],
    }),
    defineField({
      name: "sampleItineraries",
      title: "Sample itineraries",
      type: "array",
      of: [
        defineArrayMember({
          name: "sampleItinerary",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "duration", title: "Duration", type: "string" }),
            defineField({
              name: "stops",
              title: "Stops",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "duration" } },
        }),
      ],
    }),
    defineField({
      name: "whereToStay",
      title: "Where to stay",
      type: "array",
      description: "External links here are rendered as sponsored (affiliate) links.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
          ],
          marks: { annotations: [linkAnnotation] },
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        defineArrayMember({
          name: "faqItem",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
    }),
    defineField({
      name: "relatedDestinations",
      title: "Related destinations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "destination" }] })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "featuredPosts",
      title: "Featured posts",
      description: "Manual pins, shown before the automatically related posts.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "blogPost" }] })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      destinationType: "destinationType",
      isLive: "isLive",
      media: "heroImage",
    },
    prepare({ title, destinationType, isLive, media }) {
      const type = destinationTypes.find((item) => item.value === destinationType)?.title;
      return {
        title: title || "Untitled destination",
        subtitle: [type, isLive ? "🟢 Live" : "⚪ Hidden"].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
