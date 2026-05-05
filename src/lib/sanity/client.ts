import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export class MissingSanityProjectIdError extends Error {
  constructor() {
    super("Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local and Vercel environment variables.");
    this.name = "MissingSanityProjectIdError";
  }
}

export function assertSanityProjectId(): string {
  if (!projectId) {
    throw new MissingSanityProjectIdError();
  }

  return projectId;
}

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-05",
  useCdn: process.env.NODE_ENV === "production",
});
