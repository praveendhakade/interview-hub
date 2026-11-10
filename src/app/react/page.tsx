import Link from "next/link";
import { Container, Eyebrow } from "@/components/common/ui";
import { CategoryNavigation } from "@/components/questions/category-navigation";
import { QuestionFilters } from "@/components/questions/question-filters";
import { QuestionList } from "@/components/questions/question-list";
import { QuestionsLayout } from "@/components/questions/questions-layout";
import { PDFLibrary } from "@/components/pdf/pdf-library";
import { getAllCategories, getAllQuestions } from "@/lib/content";
import { getFilteredQuestions } from "@/lib/question-browsing";
import type { Difficulty } from "@/types/question";
import { createBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = createPageMetadata({
  title: "React interview questions",
  description: "Browse 40 practical React interview questions with clear explanations, code examples, difficulty levels, and topic filters.",
  path: "/react",
});

type SearchParams = Promise<{ q?: string; category?: string; difficulty?: string }>;
const validDifficulties: readonly Difficulty[] = ["beginner", "intermediate", "advanced"];

export default async function ReactQuestionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const categoryId = params.category ?? "";
  const difficulty = validDifficulties.includes(params.difficulty as Difficulty) ? params.difficulty as Difficulty : "";
  const questions = getFilteredQuestions({ query, categoryId, difficulty });
  const total = getAllQuestions().length;
  const categories = getAllCategories();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "React questions", path: "/react" },
  ]);

  return (
    <QuestionsLayout>
      {breadcrumb && <JsonLd data={breadcrumb} />}
      <section className="learning-hero">
        <Container>
          <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">React questions</span></nav>
          <Eyebrow>React interview preparation</Eyebrow>
          <h1 className="learning-title">React interview questions</h1>
          <p className="learning-intro">Build a confident understanding of React, from core rendering concepts to architecture and performance.</p>
          <p className="question-total"><strong>{total}</strong> questions across <strong>{categories.length}</strong> learning categories</p>
        </Container>
      </section>
      <section aria-label="Browse questions" className="question-browser section">
        <Container>
          <CategoryNavigation categories={categories} />
          <QuestionFilters categories={categories} query={query} categoryId={categoryId} difficulty={difficulty} />
          <div className="results-heading">
            <h2>{questions.length === total && !query && !categoryId && !difficulty ? "All React questions" : "Matching questions"}</h2>
            <span>{questions.length} {questions.length === 1 ? "result" : "results"}</span>
          </div>
          <QuestionList questions={questions} />
        </Container>
      </section>
      <PDFLibrary />
    </QuestionsLayout>
  );
}
