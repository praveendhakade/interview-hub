import { QuestionCard } from "./question-card";
import type { InterviewQuestion } from "../../types/question";

export function QuestionList({ questions }: { questions: readonly InterviewQuestion[] }) {
  if (questions.length === 0) {
    return (
      <div className="empty-results" role="status">
        <h2>No questions found</h2>
        <p>Try another search or remove one of the filters.</p>
      </div>
    );
  }

  return (
    <div className="question-grid">
      {questions.map((question) => <QuestionCard key={question.id} question={question} />)}
    </div>
  );
}
