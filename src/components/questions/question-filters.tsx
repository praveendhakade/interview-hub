import Link from "next/link";
import type { Category } from "@/types/technology";
import type { Difficulty } from "@/types/question";

const difficulties: readonly Difficulty[] = ["beginner", "intermediate", "advanced"];

export function QuestionFilters({
  categories,
  query,
  categoryId,
  difficulty,
}: {
  categories: readonly Category[];
  query: string;
  categoryId: string;
  difficulty: string;
}) {
  const hasFilters = Boolean(query || categoryId || difficulty);
  return (
    <form action="/react" className="question-filters" method="get">
      <div className="filter-search">
        <label htmlFor="question-search">Search React questions</label>
        <input autoComplete="off" id="question-search" name="q" placeholder="Try “useEffect” or “hydration”" type="search" defaultValue={query} />
      </div>
      <div className="filter-select">
        <label htmlFor="question-category">Category</label>
        <select defaultValue={categoryId} id="question-category" name="category">
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
        </select>
      </div>
      <div className="filter-select">
        <label htmlFor="question-difficulty">Difficulty</label>
        <select defaultValue={difficulty} id="question-difficulty" name="difficulty">
          <option value="">All levels</option>
          {difficulties.map((level) => <option key={level} value={level}>{level[0].toUpperCase()}{level.slice(1)}</option>)}
        </select>
      </div>
      <button className="button button-primary filter-submit" type="submit">Apply filters</button>
      {hasFilters && <Link className="button button-secondary filter-clear" href="/react">Clear filters</Link>}
    </form>
  );
}
