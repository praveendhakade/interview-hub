export type SiteLink = {
  label: string;
  href: string;
};

function getSiteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

function getConfiguredSiteUrl(): string | undefined {
  const explicitUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicitUrl) return explicitUrl;

  // This Vercel system variable always identifies the production host, including
  // during Preview builds. Avoid VERCEL_URL, which points at the current preview.
  const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return getSiteUrl(vercelProductionHost ? `https://${vercelProductionHost}` : undefined);
}

const siteUrl = getConfiguredSiteUrl();

function getOpenGraphImage(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return getHttpsUrl(value);
}

function getHttpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export const siteConfig = {
  name: "React Interview Hub",
  siteUrl,
  metadataBase: siteUrl
    ? new URL(siteUrl)
    : process.env.NODE_ENV !== "production"
      ? new URL("http://localhost:3000")
      : undefined,
  openGraphImage: getOpenGraphImage(process.env.NEXT_PUBLIC_OG_IMAGE_URL),
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  description:
    "Practical interview questions, in-depth explanations, and real-world code examples to help you become interview-ready.",
  navigation: [
    { label: "Home", href: "/#home" },
    { label: "React", href: "/react" },
    { label: "Technologies", href: "/#technologies" },
    { label: "About", href: "/#about" },
  ] satisfies SiteLink[],
  social: {
    instagramUrl: getHttpsUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? "https://www.instagram.com/ai_dev234/",
    githubUrl: getHttpsUrl(process.env.NEXT_PUBLIC_GITHUB_URL) ?? "https://github.com/praveendhakade",
    linkedinUrl: "https://www.linkedin.com/in/praveendhakade/",
  },
} as const;
