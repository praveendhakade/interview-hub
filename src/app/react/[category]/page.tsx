import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/questions/category-page";
import { getAllCategories, getCategoryBySlug } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return createPageMetadata({
    title: category.title,
    description: `${category.description} Explore ${category.questionIds.length} React interview questions with explanations and practical code examples.`,
    path: `/react/${category.slug}`,
  });
}

export default async function ReactCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  return <CategoryPage category={category} />;
}
