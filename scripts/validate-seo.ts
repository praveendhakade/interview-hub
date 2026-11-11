import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { getAllCategories, getAllQuestions } from "../src/lib/content";

const origin = process.env.SEO_AUDIT_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/react",
  ...getAllCategories().map((category) => `/react/${category.slug}`),
  ...getAllQuestions().map((question) => `/questions/${question.slug}`),
];
const routeSet = new Set([...routes, "/react/architecture"]);
const titles = new Set<string>();
const descriptions = new Set<string>();
const canonicalUrls = new Set<string>();
let pagesWithDescription = 0;

async function getHtml(path: string): Promise<{ document: Document; responseUrl: string }> {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} should return HTTP 200`);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  const responseUrl = new URL(path, origin).toString();
  const dom = new JSDOM(await response.text(), { url: responseUrl });
  return { document: dom.window.document, responseUrl };
}

function normalizeRoute(value: string): string {
  const path = decodeURI(value).replace(/\/$/, "") || "/";
  return path;
}

for (const path of routes) {
  const { document } = await getHtml(path);
  const title = document.title.trim();
  assert.ok(title, `${path} has a page title`);
  assert.ok(!titles.has(title), `duplicate title: ${title}`);
  titles.add(title);

  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content.trim();
  assert.ok(description && description.length > 0, `${path} has a meta description`);
  assert.ok(!descriptions.has(description), `${path} has a unique description`);
  descriptions.add(description);
  pagesWithDescription += 1;
  assert.equal(document.querySelector("main") !== null, true, `${path} has a main landmark`);
  assert.equal(document.querySelectorAll("h1").length, 1, `${path} has one visible page heading`);
  assert.equal(document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content.includes("noindex"), false, `${path} remains indexable`);
  assert.equal(document.querySelector("img:not([alt])"), null, `${path} images have alternative text`);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  if (canonical) {
    assert.ok(!canonical.includes("localhost") || new URL(origin).hostname === "localhost", `${path} has no localhost canonical`);
    assert.ok(!canonicalUrls.has(canonical), `duplicate canonical URL: ${canonical}`);
    canonicalUrls.add(canonical);
  }

  const openGraphDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content;
  assert.equal(openGraphDescription, description, `${path} Open Graph description matches its page`);
  assert.ok(document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content, `${path} has an Open Graph title`);
  assert.ok(document.querySelector('meta[name="twitter:card"][content="summary_large_image"]'), `${path} has a large social card`);
  assert.equal(document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.content, description, `${path} Twitter description matches its page`);

  for (const image of [...document.querySelectorAll("img")]) {
    assert.ok(image.hasAttribute("alt"));
  }
  for (const button of [...document.querySelectorAll("button")]) {
    assert.ok((button.getAttribute("aria-label") ?? button.textContent ?? "").trim(), `${path} has a named button`);
  }
  for (const control of [...document.querySelectorAll("input,select,textarea")]) {
    const id = control.getAttribute("id");
    const hasLabel = id && [...document.querySelectorAll("label[for]")].some((label) => label.getAttribute("for") === id);
    const isNamed = control.hasAttribute("aria-label") || control.hasAttribute("aria-labelledby") || hasLabel;
    assert.ok(isNamed, `${path} has a labeled form control`);
  }

  for (const link of [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]) {
    const href = link.getAttribute("href") ?? "";
    const target = new URL(href, document.URL);
    if (target.origin !== new URL(origin).origin) continue;
    const internalRoute = normalizeRoute(target.pathname);
    const isStaticFile = internalRoute.startsWith("/downloads/");
    const isSocialImage = internalRoute === "/social-image.png";
    assert.ok(routeSet.has(internalRoute) || isStaticFile || isSocialImage, `${path} contains broken internal link ${href}`);
    if (target.hash && internalRoute === normalizeRoute(new URL(document.URL).pathname)) {
      assert.ok(document.getElementById(decodeURIComponent(target.hash.slice(1))), `${path} has an anchor target for ${href}`);
    }
  }

  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((script) => JSON.parse(script.textContent ?? "null") as { "@type"?: string });
  if (path.startsWith("/questions/")) assert.ok(jsonLd.some((item) => item["@type"] === "TechArticle"), `${path} has Article JSON-LD`);
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemapResponse.status, 200);
const sitemapText = await sitemapResponse.text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(sitemapUrls.length === 0 || sitemapUrls.length === routes.length, "sitemap is empty until production origin is configured or contains all 46 routes");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap URLs are unique");
assert.ok(sitemapUrls.every((url) => !url.includes("?")), "sitemap excludes filtered query routes");
assert.ok(canonicalUrls.size === 0 || canonicalUrls.size === routes.length, "production canonical URLs are configured on every route");
assert.equal(canonicalUrls.size, sitemapUrls.length, "canonical and sitemap configuration stay in sync");
if (sitemapUrls.length) {
  assert.deepEqual(
    sitemapUrls.map((url) => new URL(url).pathname).sort(),
    routes.map(normalizeRoute).sort(),
    "sitemap contains exactly the public route set",
  );
}

const robotsResponse = await fetch(new URL("/robots.txt", origin));
assert.equal(robotsResponse.status, 200);
const robotsText = await robotsResponse.text();
assert.match(robotsText, /Allow: \/|Allow: \/\s/);
if (sitemapUrls.length) assert.match(robotsText, /Sitemap:\s+https:\/\//);
else assert.doesNotMatch(robotsText, /Sitemap:/);

const socialImage = await fetch(new URL("/social-image.png", origin));
assert.equal(socialImage.status, 200);
assert.match(socialImage.headers.get("content-type") ?? "", /image\/png/);
assert.equal((await socialImage.arrayBuffer()).byteLength > 1_000, true);

console.log(`SEO HTML validation passed: ${routes.length} routes, ${pagesWithDescription} unique descriptions, ${canonicalUrls.size} canonical URLs, sitemap ${sitemapUrls.length} entries.`);
