const defaultSiteUrl = "http://localhost:3000";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;

  try {
    const url = new URL(configuredUrl);
    return url.origin;
  } catch {
    return defaultSiteUrl;
  }
}
