import type { MetadataRoute } from "next";
import { getAllCategories, getAllQuestions } from "@/lib/content";
import { createSiteMapEntries, getPublicSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicSiteUrl();
  if (!baseUrl) return [];

  const paths = [
    "/",
    "/react",
    ...getAllCategories().map((category) => `/react/${category.slug}`),
    ...getAllQuestions().map((question) => `/questions/${question.slug}`),
  ];
  return createSiteMapEntries(baseUrl, paths);
}
