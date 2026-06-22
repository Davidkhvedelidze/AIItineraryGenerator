import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  hotspot?: unknown;
  crop?: unknown;
};

export type BlogPostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  mainImage?: SanityImage;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogCTA = {
  title?: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
};

export type BlogPost = BlogPostListItem & {
  cta?: BlogCTA;
  faq?: {
    question?: string;
    answer?: string;
  }[];
  body?: PortableTextBlock[];
};
