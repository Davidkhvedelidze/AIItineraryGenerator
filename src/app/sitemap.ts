import type { MetadataRoute } from "next";
import { popularTripIdeas } from "@/constants/popular-trip-ideas";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllTours } from "@/lib/tours";

const siteUrl = "https://tripmategeorgia.com";
const lastModified = new Date();

function absoluteUrl(path = ""): string {
  return `${siteUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tours] = await Promise.all([getAllBlogPosts(), getAllTours()]);
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
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/tours"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const tripIdeaRoutes: MetadataRoute.Sitemap = popularTripIdeas.map(
    (idea) => ({
      url: absoluteUrl(`/trip-ideas/${idea.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tourRoutes: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: absoluteUrl(`/tours/${tour.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...tripIdeaRoutes, ...blogRoutes, ...tourRoutes];
}
