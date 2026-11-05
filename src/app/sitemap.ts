import type { MetadataRoute } from "next";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { getAllBlogPosts } from "@/lib/blog";
import { getLiveDestinations } from "@/lib/destinations";
import { getAllTours } from "@/lib/tours";
import { listApprovedGalleryItineraries } from "@/lib/supabase/itineraryRequests";

const siteUrl = "https://tripmategeorgia.com";

function absoluteUrl(path = ""): string {
  return `${siteUrl}${path}`;
}

function maxDate(dates: (Date | undefined)[]): Date | undefined {
  const valid = dates.filter((date): date is Date => date instanceof Date && !Number.isNaN(date.getTime()));

  if (valid.length === 0) {
    return undefined;
  }

  return valid.reduce((latest, date) => (date > latest ? date : latest));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tours, communityItineraries, destinations] = await Promise.all([
    getAllBlogPosts(),
    getAllTours(),
    listApprovedGalleryItineraries(),
    getLiveDestinations(),
  ]);

  const blogDates = posts.map((post) => new Date(post.publishedAt ?? post._updatedAt));
  const tourDates = tours.map((tour) => new Date(tour._updatedAt));

  const blogLastModified = maxDate(blogDates);
  const tourLastModified = maxDate(tourDates);
  const destinationLastModified = maxDate(destinations.map((destination) => new Date(destination._updatedAt)));
  const siteLastModified = maxDate([...blogDates, ...tourDates]);

  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      ...(siteLastModified && { lastModified: siteLastModified }),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/trip-ideas"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/trip-ideas/community"),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/blog"),
      ...(blogLastModified && { lastModified: blogLastModified }),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/tours"),
      ...(tourLastModified && { lastModified: tourLastModified }),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const tripIdeaRoutes: MetadataRoute.Sitemap = popularTripIdeas.map((idea) => ({
    url: absoluteUrl(`/trip-ideas/${idea.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt ?? post._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tourRoutes: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: absoluteUrl(`/tours/${tour.slug}`),
    lastModified: new Date(tour._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // /destinations is noindex until a destination is live, so only list it once there is one.
  const destinationRoutes: MetadataRoute.Sitemap =
    destinations.length > 0
      ? [
          {
            url: absoluteUrl("/destinations"),
            ...(destinationLastModified && { lastModified: destinationLastModified }),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          ...destinations.map((destination) => ({
            url: absoluteUrl(`/destinations/${destination.slug}`),
            lastModified: new Date(destination._updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          })),
        ]
      : [];

  const communityRoutes: MetadataRoute.Sitemap = communityItineraries.map((item) => ({
    url: absoluteUrl(`/trip-ideas/community/${item.shortId}`),
    ...(item.submittedAt && { lastModified: new Date(item.submittedAt) }),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...routes, ...destinationRoutes, ...tripIdeaRoutes, ...blogRoutes, ...tourRoutes, ...communityRoutes];
}
