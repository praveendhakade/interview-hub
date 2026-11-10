import Link from "next/link";
import { getCategoryById } from "../../lib/content";
import { getQuestionUrl } from "../../lib/question-browsing";
import { getPdfDownloadUrl, getQuestionPdfFilename } from "../../lib/pdf-resources";
import type { InterviewQuestion } from "../../types/question";

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  const category = getCategoryById(question.categoryId);

  return (
    <article className="surface-card question-card">
      <div className="question-card-meta">
        {category && <Link className="question-category-link" href={`/react/${category.slug}`}>{category.title}</Link>}
        <span className={`difficulty-badge difficulty-${question.difficulty}`}>{question.difficulty}</span>
      </div>
      <h2><Link href={getQuestionUrl(question.slug)}>{question.title}</Link></h2>
      <p className="question-card-preview">{question.shortAnswer}</p>
      <div className="question-card-bottom">
        <div className="tag-list" aria-label="Question tags">
          {question.tags.slice(0, 3).map((tag) => <span className="question-tag" key={tag}>{tag}</span>)}
        </div>
        <span className="reading-time">{question.estimatedReadingTime} min read</span>
      </div>
      <Link className="text-link" href={getQuestionUrl(question.slug)}>
        View answer <span aria-hidden="true">→</span>
      </Link>
      <a className="question-pdf-link" download href={getPdfDownloadUrl(getQuestionPdfFilename(question.slug))}>Download PDF</a>
    </article>
  );
}
