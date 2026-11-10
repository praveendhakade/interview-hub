import Link from "next/link";
import { Container, Eyebrow } from "@/components/common/ui";
import { CodeBlock } from "@/components/questions/code-block";
import { RelatedQuestions } from "@/components/questions/related-questions";
import { QuestionToc, type TocEntry } from "@/components/questions/question-toc";
import { getAllCategories, getQuestionsByCategory, getRelatedQuestions } from "@/lib/content";
import { getCategoryUrl, getQuestionUrl } from "@/lib/question-browsing";
import type { InterviewQuestion } from "@/types/question";
import { getPdfDownloadUrl, getQuestionPdfFilename } from "@/lib/pdf-resources";
import { absoluteSiteUrl, createBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

function getTocEntries(question: InterviewQuestion): TocEntry[] {
  const entries: TocEntry[] = [{ id: "short-answer", label: "Short answer" }, { id: "explanation", label: "Explanation" }];
  if (question.keyPoints.length) entries.push({ id: "key-takeaways", label: "Key takeaways" });
  if (question.codeExamples.length) entries.push({ id: "code-examples", label: "Code examples" });
  if (question.realWorldUseCases.length) entries.push({ id: "use-cases", label: "Real-world use cases" });
  if (question.commonMistakes.length) entries.push({ id: "common-mistakes", label: "Common mistakes" });
  if (question.followUpQuestions.length) entries.push({ id: "follow-ups", label: "Follow-up questions" });
  if (getRelatedQuestions(question.id).length) entries.push({ id: "related-questions", label: "Related questions" });
  return entries;
}

function QuestionStructuredData({ question }: { question: InterviewQuestion }) {
  const categoryUrl = getCategoryUrl(question.categoryId);
  const questionUrl = getQuestionUrl(question.slug);
  const category = getAllCategories().find((item) => item.id === question.categoryId);
  const absolute = absoluteSiteUrl;
  const questionAbsoluteUrl = absolute(questionUrl);
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: question.title,
    description: question.shortAnswer,
    ...(questionAbsoluteUrl ? { url: questionAbsoluteUrl, mainEntityOfPage: questionAbsoluteUrl } : {}),
    articleSection: category?.title,
    keywords: question.tags.join(", "),
  };
  const breadcrumb = category ? createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "React questions", path: "/react" },
    { name: category.title, path: categoryUrl },
    { name: question.title, path: questionUrl },
  ]) : undefined;
  return (
    <>
      <JsonLd data={article} />
      {breadcrumb && <JsonLd data={breadcrumb} />}
    </>
  );
}

export function QuestionDetail({ question }: { question: InterviewQuestion }) {
  const category = getAllCategories().find((item) => item.id === question.categoryId);
  const categoryQuestions = getQuestionsByCategory(question.categoryId);
  const index = categoryQuestions.findIndex((item) => item.id === question.id);
  const previous = categoryQuestions[index - 1];
  const next = categoryQuestions[index + 1];
  const relatedQuestions = getRelatedQuestions(question.id);
  const entries = getTocEntries(question);

  return (
    <>
      <QuestionStructuredData question={question} />
      <section className="question-detail-hero">
        <Container>
          <nav aria-label="Breadcrumb" className="breadcrumbs">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/react">React questions</Link>
            {category && <><span aria-hidden="true">/</span><Link href={getCategoryUrl(category.id)}>{category.title}</Link></>}
            <span aria-hidden="true">/</span><span aria-current="page">{question.title}</span>
          </nav>
          <Eyebrow>Question {index + 1} of {categoryQuestions.length}</Eyebrow>
          <h1 className="question-detail-title">{question.title}</h1>
          <div className="question-detail-meta">
            <span className={`difficulty-badge difficulty-${question.difficulty}`}>{question.difficulty}</span>
            <span>{question.estimatedReadingTime} min read</span>
            {category && <Link href={getCategoryUrl(category.id)}>{category.title}</Link>}
          </div>
        </Container>
      </section>

      <Container className="question-detail-layout">
        <article className="question-article">
          <section aria-labelledby="short-answer-title" className="answer-callout question-section" id="short-answer">
            <p className="answer-label">Short answer</p>
            <h2 className="visually-hidden" id="short-answer-title">Interview-ready answer</h2>
            <p>{question.shortAnswer}</p>
          </section>

          <section aria-labelledby="explanation-title" className="question-section reading-section" id="explanation">
            <h2 id="explanation-title">Detailed explanation</h2>
            {question.detailedAnswer.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </section>

          {question.keyPoints.length > 0 && <section aria-labelledby="key-takeaways-title" className="question-section" id="key-takeaways">
            <h2 id="key-takeaways-title">Key takeaways</h2>
            <ul className="takeaway-list">{question.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </section>}

          {question.codeExamples.length > 0 && <section aria-labelledby="code-examples-title" className="question-section" id="code-examples">
            <h2 id="code-examples-title">Code examples</h2>
            <div className="code-examples-list">{question.codeExamples.map((example) => <CodeBlock key={example.title} {...example} />)}</div>
          </section>}

          {question.realWorldUseCases.length > 0 && <section aria-labelledby="use-cases-title" className="question-section" id="use-cases">
            <h2 id="use-cases-title">Real-world use cases</h2>
            <div className="use-case-grid">{question.realWorldUseCases.map((useCase) => <p className="use-case-card" key={useCase}>{useCase}</p>)}</div>
          </section>}

          {question.commonMistakes.length > 0 && <section aria-labelledby="common-mistakes-title" className="question-section" id="common-mistakes">
            <h2 id="common-mistakes-title">Common mistakes</h2>
            <ul className="mistake-list">{question.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
          </section>}

          {question.followUpQuestions.length > 0 && <section aria-labelledby="follow-ups-title" className="question-section" id="follow-ups">
            <h2 id="follow-ups-title">Interview follow-up questions</h2>
            <div className="follow-up-list">{question.followUpQuestions.map((followUp) => (
              <details className="follow-up-item surface-card" key={followUp.question}>
                <summary>{followUp.question}</summary>
                <p>{followUp.answer}</p>
              </details>
            ))}</div>
          </section>}

          <section aria-label="PDF download" className="pdf-placeholder surface-card">
            <div><strong>Take this answer with you</strong><p>Download this question as a printable guide.</p></div>
            <a className="button button-secondary" download href={getPdfDownloadUrl(getQuestionPdfFilename(question.slug))}>Download question PDF</a>
          </section>

          <RelatedQuestions questions={relatedQuestions} />

          <nav aria-label="Question navigation" className="question-pagination">
            {previous ? <Link href={getQuestionUrl(previous.slug)}><span>Previous question</span><strong>{previous.title}</strong></Link> : <span />}
            {next ? <Link href={getQuestionUrl(next.slug)}><span>Next question</span><strong>{next.title}</strong></Link> : <span />}
          </nav>
          {category && <p className="back-to-category"><Link href={getCategoryUrl(category.id)}>← Back to {category.title}</Link></p>}
        </article>
        <aside aria-label="Page navigation" className="question-aside"><QuestionToc entries={entries} /></aside>
      </Container>
    </>
  );
}
