import type { MetadataRoute } from "next";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const lastModified = new Date();

function absoluteUrl(path = ""): string {
  return `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/trip-ideas"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const tripIdeaRoutes: MetadataRoute.Sitemap = popularTripIdeas.map((idea) => ({
    url: absoluteUrl(`/trip-ideas/${idea.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...routes,
    ...tripIdeaRoutes,
  ];
}
