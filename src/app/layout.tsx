import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/roboto-mono/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  ...(siteConfig.metadataBase ? { metadataBase: siteConfig.metadataBase } : {}),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: { index: true, follow: true },
  ...(siteConfig.googleSiteVerification ? { verification: { google: siteConfig.googleSiteVerification } } : {}),
  openGraph: {
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    ...(siteConfig.metadataBase ? { images: [{ url: siteConfig.openGraphImage ?? "/social-image.png", width: 1200, height: 630, alt: siteConfig.name }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.metadataBase ? { images: [siteConfig.openGraphImage ?? "/social-image.png"] } : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
