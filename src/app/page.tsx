import { JsonLd } from "@/components/seo/json-ld";
import { Benefits } from "@/components/home/benefits";
import { FeaturedResources } from "@/components/home/featured-resources";
import { Hero } from "@/components/home/hero";
import { InstagramCta } from "@/components/home/instagram-cta";
import { TechnologyGrid } from "@/components/home/technology-grid";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { absoluteSiteUrl, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Developer interview preparation",
  description: "Build confidence for your next developer interview with practical React questions, clear explanations, real-world examples, and free PDF guides.",
  path: "/",
});

export default function Home() {
  const url = absoluteSiteUrl("/");
  const website = url ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteSiteUrl("/react")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } : undefined;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      {website && <JsonLd data={website} />}
      <main id="main-content">
        <Hero />
        <TechnologyGrid />
        <FeaturedResources />
        <Benefits />
        <InstagramCta />
      </main>
      <Footer />
    </div>
  );
}
