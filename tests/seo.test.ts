import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllCategories, getAllQuestions } from "../src/lib/content";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createQuestionDescription,
  createRobotsConfig,
  createSiteMapEntries,
  serializeJsonLd,
} from "../src/lib/seo";

describe("SEO metadata and crawler routes", () => {
  it("creates distinct question descriptions, canonical paths, and social cards", () => {
    const metadata = getAllQuestions().map((question) => createPageMetadata({
      title: question.title,
      description: createQuestionDescription(question.title, question.shortAnswer),
      path: `/questions/${question.slug}`,
      type: "article",
      image: `/social-image?title=${encodeURIComponent(question.title)}`,
    }));

    assert.equal(new Set(metadata.map((item) => item.title)).size, 40);
    assert.equal(new Set(metadata.map((item) => item.description)).size, 40);
    for (const item of metadata) {
      assert.ok(item.description && item.description.length <= 160);
      assert.ok(item.alternates?.canonical);
      assert.equal(item.openGraph && "type" in item.openGraph ? item.openGraph.type : undefined, "article");
      assert.equal(item.twitter && "card" in item.twitter ? item.twitter.card : undefined, "summary_large_image");
      assert.ok(item.openGraph && "images" in item.openGraph && Array.isArray(item.openGraph.images));
      assert.equal(item.openGraph && "images" in item.openGraph && Array.isArray(item.openGraph.images) ? item.openGraph.images.length : 0, 1);
    }
  });

  it("lists only the landing, React listing, categories, and valid question routes", () => {
    const paths = [
      "/", "/react",
      ...getAllCategories().map((category) => `/react/${category.slug}`),
      ...getAllQuestions().map((question) => `/questions/${question.slug}`),
    ];
    const entries = createSiteMapEntries("https://interviewhub.example", paths);
    assert.equal(entries.length, 46);
    assert.equal(new Set(entries.map((entry) => entry.url)).size, 46);
    assert.ok(entries.every((entry) => entry.url.startsWith("https://interviewhub.example/")));
    assert.ok(!entries.some((entry) => entry.url.endsWith("/react/architecture")));
    assert.ok(!entries.some((entry) => entry.url.endsWith("/react/architecture")));
  });

  it("points crawlers to the sitemap without blocking public content", () => {
    assert.deepEqual(createRobotsConfig("https://interviewhub.example"), {
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://interviewhub.example/sitemap.xml",
    });
    assert.deepEqual(createRobotsConfig(null), { rules: { userAgent: "*", allow: "/" } });
  });

  it("builds breadcrumb schema and safely escapes JSON-LD script content", () => {
    const breadcrumb = createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "React", path: "/react" },
    ]);
    assert.equal(breadcrumb?.itemListElement.length, 2);
    assert.ok(breadcrumb?.itemListElement[0].item.startsWith("http"));

    const serialized = serializeJsonLd({ headline: "</script><script>alert(1)</script> & \u2028" });
    assert.ok(!serialized.toLowerCase().includes("</script"));
    assert.deepEqual(JSON.parse(serialized), { headline: "</script><script>alert(1)</script> & \u2028" });
  });
});
