import { Document } from "@react-pdf/renderer";
import type { Category } from "@/types/technology";
import type { InterviewQuestion } from "@/types/question";
import { PDFCoverPage, PDFQuestionPage, PDFTableOfContents } from "./pdf-components";

export type PDFDocumentKind = "question" | "collection" | "complete";

export function PDFDocument({
  title,
  subtitle,
  kind,
  questions,
  categories,
}: {
  title: string;
  subtitle: string;
  kind: PDFDocumentKind;
  questions: readonly InterviewQuestion[];
  categories: readonly Category[];
}) {
  const label = kind === "question" ? "Individual question guide" : title;
  return (
    <Document title={title} author="React Interview Hub" creator="React Interview Hub" subject={subtitle}>
      <PDFCoverPage title={title} subtitle={subtitle} questionCount={questions.length} kind={kind} />
      {kind !== "question" && <PDFTableOfContents questions={questions} categories={categories} title={title} />}
      {questions.map((question) => <PDFQuestionPage key={question.id} question={question} label={label} />)}
    </Document>
  );
}
