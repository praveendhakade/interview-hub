import type { Difficulty, InterviewQuestion } from "../types/question";
import { getAllQuestions, getCategoryById, searchQuestions } from "./content";

export type QuestionFilters = {
  query?: string;
  categoryId?: string;
  difficulty?: Difficulty | "";
};

export function getFilteredQuestions({ query = "", categoryId = "", difficulty = "" }: QuestionFilters): InterviewQuestion[] {
  const results = query.trim() ? searchQuestions(query) : getAllQuestions();
  return results.filter((question) =>
    (!categoryId || question.categoryId === categoryId)
    && (!difficulty || question.difficulty === difficulty),
  );
}

export function getQuestionUrl(slug: string): string {
  return `/questions/${slug}`;
}

export function getCategoryUrl(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category ? `/react/${category.slug}` : "/react";
}
