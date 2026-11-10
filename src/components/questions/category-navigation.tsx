import Link from "next/link";
import type { Category } from "@/types/technology";

export function CategoryNavigation({ categories, activeCategoryId }: { categories: readonly Category[]; activeCategoryId?: string }) {
  return (
    <nav aria-label="React question categories" className="category-navigation">
      <Link aria-current={!activeCategoryId ? "page" : undefined} href="/react">All questions</Link>
      {categories.map((category) => (
        <Link aria-current={activeCategoryId === category.id ? "page" : undefined} href={`/react/${category.slug}`} key={category.id}>
          {category.title}
        </Link>
      ))}
    </nav>
  );
}
