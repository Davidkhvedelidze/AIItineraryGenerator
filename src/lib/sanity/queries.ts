import { groq } from "next-sanity";

const blogPostListFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  tags,
  publishedAt,
  mainImage,
  metaTitle,
  metaDescription
`;

export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    ${blogPostListFields}
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && slug.current == $slug][0] {
    ${blogPostListFields},
    faq,
    body
  }
`;

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`;
