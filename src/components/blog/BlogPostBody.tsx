import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";
import { getSanityImageUrl } from "@/lib/sanity/image";
import styles from "./blog.module.css";

export function BlogPostBody({
  body,
  title,
}: {
  body: PortableTextBlock[];
  title: string;
}) {
  return (
    <div className={styles.prose}>
      <PortableText
        value={body}
        components={{
          block: {
            // An article already has a page title; CMS h1 blocks belong to the body hierarchy.
            h1: ({ children }) => <h2>{children}</h2>,
            h2: ({ children, value }) => (
              <h2 id={value._key ? `section-${value._key}` : undefined}>
                {children}
              </h2>
            ),
            h3: ({ children }) => <h3>{children}</h3>,
            h4: ({ children }) => <h4>{children}</h4>,
            normal: ({ children }) => <p>{children}</p>,
            blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          },
          types: {
            image: ({ value }) => {
              const imageUrl = getSanityImageUrl(value, {
                width: 1100,
                fit: "max",
              });
              if (!imageUrl) return null;
              const alt =
                typeof value.alt === "string" && value.alt.trim()
                  ? value.alt
                  : `Travel photograph from ${title}`;
              return (
                <Image
                  src={imageUrl}
                  alt={alt}
                  width={1100}
                  height={715}
                  sizes="(min-width: 1024px) 740px, calc(100vw - 32px)"
                  className="my-8 h-auto w-full rounded-2xl"
                />
              );
            },
          },
          marks: {
            link: ({ children, value }) => {
              const href =
                typeof value?.href === "string" ? value.href.trim() : "";
              const safe = /^(https?:\/\/|mailto:|tel:|#|\/(?![\/\\]))/i.test(
                href,
              );
              if (!safe) return <>{children}</>;
              const external = /^https?:\/\//i.test(href);
              return (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
          },
        }}
      />
    </div>
  );
}
