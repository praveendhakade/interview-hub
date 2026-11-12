import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { getAllCategories, getAllQuestions } from "../src/lib/content";
import { createPdfManifest } from "../src/lib/pdf-resources";
import { getFilteredQuestions } from "../src/lib/question-browsing";

const configuredOrigin = process.env.PRODUCTION_URL;
assert.ok(configuredOrigin, "Set PRODUCTION_URL to the deployed site or a local production server.");
const originUrl = new URL(configuredOrigin);
assert.ok(originUrl.protocol === "https:" || ["localhost", "127.0.0.1"].includes(originUrl.hostname), "PRODUCTION_URL must use HTTPS except for local smoke tests.");
const origin = originUrl.origin;
const expectedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
const expectedCanonicalOrigin = expectedSiteUrl
  ? new URL(expectedSiteUrl.startsWith("https://") ? expectedSiteUrl : `https://${expectedSiteUrl}`).origin
  : undefined;
assert.ok(expectedCanonicalOrigin, "Set NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL to check canonical URLs and sitemap entries.");

const routes = [
  "/",
  "/react",
  ...getAllCategories().map((category) => `/react/${category.slug}`),
  ...getAllQuestions().map((question) => `/questions/${question.slug}`),
];

async function getResponse(path: string): Promise<Response> {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} should return HTTP 200`);
  return response;
}

for (const path of routes) {
  const response = await getResponse(path);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/, `${path} should return HTML`);
  const document = new JSDOM(await response.text(), { url: new URL(path, origin).toString() }).window.document;
  assert.ok(document.title.trim(), `${path} should have a page title`);
  assert.equal(document.querySelectorAll("main h1").length, 1, `${path} should have one main heading`);

  if (expectedCanonicalOrigin) {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
    assert.ok(canonical, `${path} should publish a canonical URL`);
    assert.equal(new URL(canonical).origin, expectedCanonicalOrigin, `${path} canonical should use the production origin`);
    for (const property of ["og:url", "og:image"]) {
      const value = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.content;
      if (value) assert.equal(new URL(value).origin, expectedCanonicalOrigin, `${path} ${property} should use the production origin`);
    }
  }
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && path === "/") {
    assert.equal(
      document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]')?.content,
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      "homepage should include the configured Search Console verification tag",
    );
  }
}

const questionSearch = getFilteredQuestions({ query: "useEffect" });
assert.ok(questionSearch.length > 0);
const searchResponse = await getResponse(`/react?q=${encodeURIComponent("useEffect")}`);
const searchDocument = new JSDOM(await searchResponse.text()).window.document;
assert.ok(searchDocument.body.textContent?.includes(`${questionSearch.length} ${questionSearch.length === 1 ? "result" : "results"}`), "search results should match the content search");

const category = getAllCategories()[0];
const categoryQuestions = getFilteredQuestions({ categoryId: category.id });
const filterResponse = await getResponse(`/react?category=${encodeURIComponent(category.id)}`);
const filterDocument = new JSDOM(await filterResponse.text()).window.document;
assert.ok(filterDocument.body.textContent?.includes(`${categoryQuestions.length} ${categoryQuestions.length === 1 ? "result" : "results"}`), "category filter should show its matching results");

const manifest = createPdfManifest();
for (const pdf of manifest) {
  const response = await getResponse(`/api/downloads/${pdf.fileName}`);
  assert.match(response.headers.get("content-type") ?? "", /application\/pdf/, `${pdf.fileName} should have a PDF content type`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert.ok(bytes.byteLength > 100, `${pdf.fileName} should not be empty`);
  assert.equal(new TextDecoder().decode(bytes.subarray(0, 5)), "%PDF-", `${pdf.fileName} should have a valid PDF signature`);
}

const sitemapResponse = await getResponse("/sitemap.xml");
const sitemapText = await sitemapResponse.text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, routes.length, "sitemap should contain every public route");
assert.ok(sitemapUrls.every((url) => new URL(url).origin === expectedCanonicalOrigin), "sitemap entries should use the production origin");

const robotsResponse = await getResponse("/robots.txt");
assert.ok((await robotsResponse.text()).includes(`Sitemap: ${expectedCanonicalOrigin}/sitemap.xml`), "robots.txt should point to the production sitemap");

const healthResponse = await getResponse("/api/health");
assert.equal((await healthResponse.json() as { status: string }).status, "ok");

console.info(`Production smoke checks passed: ${routes.length} HTML routes, search and category filters, ${manifest.length} PDFs, production sitemap/robots, and health endpoint.`);
