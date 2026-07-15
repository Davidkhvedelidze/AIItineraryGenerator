import type { MetadataRoute } from "next";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllTours } from "@/lib/tours";

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
  const [posts, tours] = await Promise.all([getAllBlogPosts(), getAllTours()]);

  const blogDates = posts.map((post) => new Date(post.publishedAt ?? post._updatedAt));
  const tourDates = tours.map((tour) => new Date(tour._updatedAt));

  const blogLastModified = maxDate(blogDates);
  const tourLastModified = maxDate(tourDates);
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

  return [...routes, ...tripIdeaRoutes, ...blogRoutes, ...tourRoutes];
}
