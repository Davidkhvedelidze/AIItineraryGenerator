import type { PortableTextBlock } from "next-sanity";

export function formatBlogDate(
  value?: string,
  dateStyle: "medium" | "long" = "medium",
) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { dateStyle, timeZone: "UTC" }).format(
    date,
  );
}

function getBlockText(block: PortableTextBlock) {
  return block._type === "block" && Array.isArray(block.children)
    ? block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("")
    : "";
}

export function getBlogHeadings(body: PortableTextBlock[] = []) {
  return body.flatMap((block) => {
    const text = getBlockText(block).trim();
    return block.style === "h2" && block._key && text
      ? [{ id: `section-${block._key}`, text }]
      : [];
  });
}

export function getBlogReadingMinutes(body: PortableTextBlock[] = []) {
  const text = body.map(getBlockText).join(" ").trim();
  return text ? Math.max(1, Math.ceil(text.split(/\s+/).length / 220)) : null;
}
