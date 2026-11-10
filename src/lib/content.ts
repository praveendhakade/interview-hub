import type { Difficulty, InterviewQuestion } from "../types/question";
import type { Category, Technology } from "../types/technology";
import { reactQuestions } from "../content/react";
import { technologies } from "../content/technologies";

const questions: readonly InterviewQuestion[] = reactQuestions;
const questionsById = new Map(questions.map((question) => [question.id, question]));
const questionsBySlug = new Map(questions.map((question) => [question.slug, question]));
const allCategories: readonly Category[] = technologies.flatMap((technology) => technology.categories);
const categoriesById = new Map(allCategories.map((category) => [category.id, category]));
const categoriesBySlug = new Map(allCategories.map((category) => [category.slug, category]));
const technologiesBySlug = new Map(technologies.map((technology) => [technology.slug, technology]));
const technologiesById = new Map(technologies.map((technology) => [technology.id, technology]));

export function getAllTechnologies(): readonly Technology[] {
  return technologies;
}

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return technologiesBySlug.get(slug);
}

export function getAllCategories(): readonly Category[] {
  return allCategories;
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categoriesById.get(categoryId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesBySlug.get(slug);
}

export function getAllQuestions(): readonly InterviewQuestion[] {
  return questions;
}

export function getQuestionBySlug(slug: string): InterviewQuestion | undefined {
  return questionsBySlug.get(slug);
}

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return questionsById.get(id);
}

export function getQuestionsByCategory(categoryId: string): InterviewQuestion[] {
  const category = categoriesById.get(categoryId);
  if (!category) return [];

  return category.questionIds.flatMap((id) => {
    const question = questionsById.get(id);
    return question ? [question] : [];
  });
}

export function getQuestionsByTechnology(technologyId: string): InterviewQuestion[] {
  const technology = technologiesById.get(technologyId);
  if (!technology) return [];

  const questionIds = new Set(technology.categories.flatMap((category) => category.questionIds));
  return questions.filter((question) => questionIds.has(question.id));
}

export function getRelatedQuestions(questionId: string): InterviewQuestion[] {
  const question = questionsById.get(questionId);
  if (!question) return [];

  return question.relatedQuestionIds.flatMap((id) => {
    const relatedQuestion = questionsById.get(id);
    return relatedQuestion ? [relatedQuestion] : [];
  });
}

export function getQuestionsByDifficulty(difficulty: Difficulty): InterviewQuestion[] {
  return questions.filter((question) => question.difficulty === difficulty);
}

export function getQuestionCountByCategory(categoryId: string): number {
  return categoriesById.get(categoryId)?.questionIds.length ?? 0;
}

function normalizeSearchText(value: string): string {
  return value.normalize("NFKD").toLocaleLowerCase().trim();
}

export function searchQuestions(query: string): InterviewQuestion[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [...questions];

  return questions.filter((question) => {
    const category = categoriesById.get(question.categoryId);
    const technology = technologiesById.get(question.technologyId);
    const searchableText = [
      question.title,
      question.shortAnswer,
      question.detailedAnswer,
      ...question.keyPoints,
      ...question.tags,
      category?.title ?? "",
      technology?.name ?? "",
    ].map(normalizeSearchText);

    return searchableText.some((value) => value.includes(normalizedQuery));
  });
}
