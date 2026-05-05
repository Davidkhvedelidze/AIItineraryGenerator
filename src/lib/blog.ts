import type { BlogPost, BlogPostListItem } from "@/types/sanity-blog";
import { MissingSanityProjectIdError, assertSanityProjectId, sanityClient } from "@/lib/sanity/client";
import { blogPostBySlugQuery, blogPostSlugsQuery, blogPostsQuery } from "@/lib/sanity/queries";

type BlogPostSlug = {
  slug: string;
};

const sanityFetchOptions =
  process.env.NODE_ENV === "development" ? { cache: "no-store" as const } : { next: { revalidate: 3600 } };

export async function getAllBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<BlogPostListItem[]>(blogPostsQuery, {}, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<BlogPost | null>(blogPostBySlugQuery, { slug }, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error(`Failed to fetch Sanity blog post for slug "${slug}":`, error);
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<BlogPostSlug[]> {
  try {
    assertSanityProjectId();

    return await sanityClient.fetch<BlogPostSlug[]>(blogPostSlugsQuery, {}, sanityFetchOptions);
  } catch (error) {
    if (error instanceof MissingSanityProjectIdError) {
      throw error;
    }

    console.error("Failed to fetch Sanity blog post slugs:", error);
    return [];
  }
}

export async function getRelatedBlogPosts(currentSlug: string, limit = 3): Promise<BlogPostListItem[]> {
  const posts = await getAllBlogPosts();

  return posts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}
