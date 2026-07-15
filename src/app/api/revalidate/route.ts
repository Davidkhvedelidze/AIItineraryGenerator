import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type SanityWebhookPayload = {
  _type?: string;
  slug?: string | { current?: string };
};

function getSecretFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  return (
    request.headers.get("x-sanity-revalidate-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("secret")
  );
}

function secretsMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

function getSlug(payload: SanityWebhookPayload): string | null {
  if (typeof payload.slug === "string") {
    return payload.slug;
  }

  return payload.slug?.current ?? null;
}

function revalidateBlogPaths(slug: string | null) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

function revalidateTourPaths(slug: string | null) {
  revalidatePath("/tours");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/tours/${slug}`);
  }
}

export async function POST(request: Request) {
  const configuredSecret = process.env.SANITY_REVALIDATE_SECRET?.trim();

  if (!configuredSecret) {
    return NextResponse.json(
      { revalidated: false, message: "SANITY_REVALIDATE_SECRET is not configured." },
      { status: 500 },
    );
  }

  const requestSecret = getSecretFromRequest(request);

  if (!requestSecret || !secretsMatch(requestSecret, configuredSecret)) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid revalidation secret." },
      { status: 401 },
    );
  }

  let payload: SanityWebhookPayload;

  try {
    payload = (await request.json()) as SanityWebhookPayload;
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const slug = getSlug(payload);

  if (payload._type === "blogPost") {
    revalidateBlogPaths(slug);

    return NextResponse.json({
      revalidated: true,
      paths: slug ? ["/blog", `/blog/${slug}`, "/sitemap.xml"] : ["/blog", "/sitemap.xml"],
    });
  }

  if (payload._type === "tour") {
    revalidateTourPaths(slug);

    return NextResponse.json({
      revalidated: true,
      paths: slug ? ["/tours", `/tours/${slug}`, "/sitemap.xml"] : ["/tours", "/sitemap.xml"],
    });
  }

  if (payload._type) {
    return NextResponse.json({
      revalidated: false,
      message: `Ignored unsupported document type: ${payload._type}`,
    });
  }

  revalidateBlogPaths(slug);
  revalidateTourPaths(slug);

  return NextResponse.json({
    revalidated: true,
    paths: slug
      ? ["/blog", `/blog/${slug}`, "/tours", `/tours/${slug}`, "/sitemap.xml"]
      : ["/blog", "/tours", "/sitemap.xml"],
  });
}
