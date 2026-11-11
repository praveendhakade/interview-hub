import type { Metadata } from "next";
import { siteConfig } from "../config/site";

export const DEFAULT_SOCIAL_IMAGE = "/social-image.png";

export function getPublicSiteUrl(): string | undefined {
  return siteConfig.siteUrl ?? (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined);
}

export function canonicalPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function createQuestionDescription(title: string, shortAnswer: string, maxLength = 160): string {
  const description = `${title}. ${shortAnswer}`.replace(/\s+/g, " ").trim();
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength - 1).trimEnd()}…`;
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const canonical = canonicalPath(path);
  const socialImage = siteConfig.openGraphImage ?? image ?? DEFAULT_SOCIAL_IMAGE;
  const canPublishCanonical = Boolean(siteConfig.siteUrl) || process.env.NODE_ENV !== "production";
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      type,
      siteName: siteConfig.name,
      title,
      description,
      ...(canPublishCanonical ? {
        url: canonical,
        images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
      } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(canPublishCanonical ? { images: [{ url: socialImage, alt: title }] } : {}),
    },
  };

  if (canPublishCanonical) metadata.alternates = { canonical };
  return metadata;
}

export function absoluteSiteUrl(path: string): string | undefined {
  const base = getPublicSiteUrl();
  return base ? new URL(canonicalPath(path), base).toString() : undefined;
}

export function createRobotsConfig(siteUrl?: string | null) {
  const publicUrl = siteUrl === null ? undefined : siteUrl ?? getPublicSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(publicUrl ? { sitemap: new URL("/sitemap.xml", publicUrl).toString() } : {}),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function createBreadcrumbSchema(items: readonly { name: string; path: string }[]) {
  const absoluteItems = items.map((item) => {
    const url = absoluteSiteUrl(item.path);
    return url ? { name: item.name, item: url } : undefined;
  });

  if (absoluteItems.some((item) => !item)) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: absoluteItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item!.name,
      item: item!.item,
    })),
  };
}

export function createSiteMapEntries(baseUrl: string, paths: readonly string[]) {
  const normalizedBase = new URL(baseUrl);
  const uniquePaths = [...new Set(paths.map(canonicalPath))];
  return uniquePaths.map((path) => ({ url: new URL(path, normalizedBase).toString() }));
}
