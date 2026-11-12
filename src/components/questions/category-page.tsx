import Link from "next/link";
import { Container, Eyebrow } from "@/components/common/ui";
import { CategoryNavigation } from "@/components/questions/category-navigation";
import { QuestionList } from "@/components/questions/question-list";
import { QuestionsLayout } from "@/components/questions/questions-layout";
import { getAllCategories, getQuestionsByCategory } from "@/lib/content";
import type { Category } from "@/types/technology";
import { getCategoryPdfFilename, getPdfDownloadUrl } from "@/lib/pdf-resources";
import { createBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export function CategoryPage({ category }: { category: Category }) {
  const questions = getQuestionsByCategory(category.id);
  const categories = getAllCategories();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "React questions", path: "/react" },
    { name: category.title, path: `/react/${category.slug}` },
  ]);
  return (
    <QuestionsLayout>
      {breadcrumb && <JsonLd data={breadcrumb} />}
      <section className="learning-hero">
        <Container>
          <nav aria-label="Breadcrumb" className="breadcrumbs">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/react">React questions</Link><span aria-hidden="true">/</span><span aria-current="page">{category.title}</span>
          </nav>
          <Eyebrow>React learning collection</Eyebrow>
          <h1 className="learning-title">{category.title}</h1>
          <p className="learning-intro">{category.description}</p>
          <p className="question-total"><strong>{questions.length}</strong> interview questions</p>
          <a className="button button-secondary category-pdf-download" href={getPdfDownloadUrl(getCategoryPdfFilename(category.slug))}>Download category guide</a>
        </Container>
      </section>
      <section aria-label={`${category.title} questions`} className="question-browser section">
        <Container>
          <CategoryNavigation activeCategoryId={category.id} categories={categories} />
          <div className="results-heading"><h2>Questions in this collection</h2><span>Beginner to advanced</span></div>
          <QuestionList questions={questions} />
        </Container>
      </section>
    </QuestionsLayout>
  );
}
