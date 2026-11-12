import { getAllCategories, getAllQuestions } from "./content";
import type { Category } from "../types/technology";
import type { InterviewQuestion } from "../types/question";

export type PdfTarget = {
  kind: "question" | "category" | "complete";
  fileName: string;
  title: string;
  subtitle: string;
  questions: readonly InterviewQuestion[];
  categories: readonly Category[];
};

export function getQuestionPdfFilename(slug: string): string {
  return `react-question-${slug}.pdf`;
}

export function getCategoryPdfFilename(slug: string): string {
  return `react-${slug}.pdf`;
}

export const COMPLETE_GUIDE_FILENAME = "react-interview-preparation-guide.pdf";

export function getPdfDownloadUrl(fileName: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/.test(fileName)) {
    throw new Error(`Invalid PDF filename: ${fileName}`);
  }
  return `/api/downloads/${fileName}`;
}

export function createPdfManifest(
  questions: readonly InterviewQuestion[] = getAllQuestions(),
  categories: readonly Category[] = getAllCategories(),
): PdfTarget[] {
  if (!questions.length) throw new Error("Cannot generate PDF resources without questions.");
  if (!categories.length) throw new Error("Cannot generate PDF resources without categories.");

  const questionById = new Map<string, InterviewQuestion>();
  const questionSlugs = new Set<string>();
  for (const question of questions) {
    if (questionById.has(question.id)) throw new Error(`Duplicate question id in PDF source: ${question.id}`);
    if (questionSlugs.has(question.slug)) throw new Error(`Duplicate question slug in PDF source: ${question.slug}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(question.slug)) throw new Error(`Invalid question slug for PDF filename: ${question.slug}`);
    questionById.set(question.id, question);
    questionSlugs.add(question.slug);
  }

  const categorySlugs = new Set<string>();
  const targets: PdfTarget[] = questions.map((question) => ({
    kind: "question",
    fileName: getQuestionPdfFilename(question.slug),
    title: question.title,
    subtitle: question.shortAnswer,
    questions: [question],
    categories: categories.filter((category) => category.id === question.categoryId),
  }));

  for (const category of categories) {
    if (categorySlugs.has(category.slug)) throw new Error(`Duplicate category slug in PDF source: ${category.slug}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) throw new Error(`Invalid category slug for PDF filename: ${category.slug}`);
    categorySlugs.add(category.slug);
    const categoryQuestions = category.questionIds.map((id) => {
      const question = questionById.get(id);
      if (!question) throw new Error(`Category "${category.id}" references missing question "${id}".`);
      if (question.categoryId !== category.id) throw new Error(`Question "${id}" is assigned to a different category.`);
      return question;
    });
    if (!categoryQuestions.length) throw new Error(`Category "${category.id}" has no questions to include in its PDF.`);
    targets.push({
      kind: "category",
      fileName: getCategoryPdfFilename(category.slug),
      title: category.title,
      subtitle: category.description,
      questions: categoryQuestions,
      categories: [category],
    });
  }

  targets.push({
    kind: "complete",
    fileName: COMPLETE_GUIDE_FILENAME,
    title: "Complete React Interview Preparation Guide",
    subtitle: "A practical collection of React concepts, interview answers, code examples, and follow-up questions.",
    questions,
    categories,
  });

  const uniqueFiles = new Set(targets.map((target) => target.fileName));
  if (uniqueFiles.size !== targets.length) throw new Error("PDF filename collision detected in the generated manifest.");
  return targets;
}
