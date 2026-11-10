import Link from "next/link";
import { getQuestionUrl } from "../../lib/question-browsing";
import type { InterviewQuestion } from "../../types/question";

export function RelatedQuestions({ questions }: { questions: readonly InterviewQuestion[] }) {
  if (!questions.length) return null;
  return (
    <section aria-labelledby="related-title" className="question-section" id="related-questions">
      <h2 id="related-title">Related questions</h2>
      <div className="related-question-list">
        {questions.map((question) => (
          <Link className="related-question-card surface-card" href={getQuestionUrl(question.slug)} key={question.id}>
            <span>{question.title}</span><span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
