import type { Difficulty, InterviewQuestion } from "../types/question";
import type { AvailabilityStatus, Technology } from "../types/technology";
import { getAllQuestions, getAllTechnologies } from "./content";

export type ContentDataset = {
  questions: readonly InterviewQuestion[];
  technologies: readonly Technology[];
};

export type ContentValidationResult = {
  valid: boolean;
  errors: readonly string[];
};

const validDifficulties: readonly Difficulty[] = ["beginner", "intermediate", "advanced"];
const validStatuses: readonly AvailabilityStatus[] = ["available", "coming-soon"];

function addUniqueValue(
  value: string,
  seen: Set<string>,
  errors: string[],
  kind: string,
  owner: string,
) {
  if (seen.has(value)) errors.push(`${owner}: duplicate ${kind} "${value}".`);
  else seen.add(value);
}

export function validateContent(
  dataset: ContentDataset = {
    questions: getAllQuestions(),
    technologies: getAllTechnologies(),
  },
): ContentValidationResult {
  const errors: string[] = [];
  const technologyIds = new Set<string>();
  const technologySlugs = new Set<string>();
  const categoryIds = new Set<string>();
  const categorySlugs = new Set<string>();
  const categoryTechnology = new Map<string, string>();
  const categoryQuestionIds = new Map<string, Set<string>>();
  const questionIds = new Set<string>();
  const questionSlugs = new Set<string>();
  const questionById = new Map<string, InterviewQuestion>();

  for (const technology of dataset.technologies) {
    const owner = `Technology "${technology.id || "(missing id)"}"`;
    if (!technology.id.trim()) errors.push(`${owner}: id is required.`);
    if (!technology.name.trim()) errors.push(`${owner}: name is required.`);
    if (!technology.slug.trim()) errors.push(`${owner}: slug is required.`);
    if (!technology.description.trim()) errors.push(`${owner}: description is required.`);
    if (!technology.icon.trim()) errors.push(`${owner}: icon is required.`);
    if (!validStatuses.includes(technology.status)) errors.push(`${owner}: invalid availability status "${technology.status}".`);
    addUniqueValue(technology.id, technologyIds, errors, "id", owner);
    addUniqueValue(technology.slug, technologySlugs, errors, "slug", owner);

    for (const category of technology.categories) {
      const categoryOwner = `Category "${category.id || "(missing id)"}"`;
      if (!category.id.trim()) errors.push(`${categoryOwner}: id is required.`);
      if (!category.title.trim()) errors.push(`${categoryOwner}: title is required.`);
      if (!category.slug.trim()) errors.push(`${categoryOwner}: slug is required.`);
      if (!category.description.trim()) errors.push(`${categoryOwner}: description is required.`);
      if (category.technologyId !== technology.id) {
        errors.push(`${categoryOwner}: technologyId "${category.technologyId}" does not match parent technology "${technology.id}".`);
      }
      addUniqueValue(category.id, categoryIds, errors, "id", categoryOwner);
      addUniqueValue(category.slug, categorySlugs, errors, "slug", categoryOwner);
      categoryTechnology.set(category.id, category.technologyId);
      categoryQuestionIds.set(category.id, new Set(category.questionIds));
      if (category.questionIds.length === 0) errors.push(`${categoryOwner}: at least one question is required.`);
    }
  }

  for (const question of dataset.questions) {
    const owner = `Question "${question.id || "(missing id)"}"`;
    if (!question.id.trim()) errors.push(`${owner}: id is required.`);
    if (!question.slug.trim()) errors.push(`${owner}: slug is required.`);
    if (!question.title.trim()) errors.push(`${owner}: title is required.`);
    if (!question.shortAnswer.trim()) errors.push(`${owner}: shortAnswer must not be empty.`);
    if (!question.detailedAnswer.trim()) errors.push(`${owner}: detailedAnswer must not be empty.`);
    if (question.instagramReelUrl && !/^https:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/.test(question.instagramReelUrl)) {
      errors.push(`${owner}: instagramReelUrl must be an Instagram reel URL.`);
    }
    if (!validDifficulties.includes(question.difficulty)) errors.push(`${owner}: invalid difficulty "${question.difficulty}".`);
    if (!technologyIds.has(question.technologyId)) errors.push(`${owner}: unknown technologyId "${question.technologyId}".`);
    if (!categoryIds.has(question.categoryId)) errors.push(`${owner}: unknown categoryId "${question.categoryId}".`);
    if (categoryTechnology.has(question.categoryId) && categoryTechnology.get(question.categoryId) !== question.technologyId) {
      errors.push(`${owner}: category "${question.categoryId}" belongs to a different technology.`);
    }
    if (categoryQuestionIds.has(question.categoryId) && !categoryQuestionIds.get(question.categoryId)?.has(question.id)) {
      errors.push(`${owner}: category "${question.categoryId}" does not list this question id.`);
    }
    if (question.keyPoints.length < 3 || question.keyPoints.length > 6 || question.keyPoints.some((point) => !point.trim())) {
      errors.push(`${owner}: keyPoints must contain 3–6 non-empty entries.`);
    }
    if (question.codeExamples.length === 0) errors.push(`${owner}: at least one code example is required.`);
    for (const [index, example] of question.codeExamples.entries()) {
      if (!example.title.trim() || !example.language.trim() || !example.code.trim() || !example.explanation.trim()) {
        errors.push(`${owner}: code example ${index + 1} is missing a required field.`);
      }
    }
    if (question.realWorldUseCases.length === 0 || question.realWorldUseCases.some((item) => !item.trim())) {
      errors.push(`${owner}: at least one non-empty realWorldUseCase is required.`);
    }
    if (question.commonMistakes.length < 2 || question.commonMistakes.length > 4 || question.commonMistakes.some((item) => !item.trim())) {
      errors.push(`${owner}: commonMistakes must contain 2–4 non-empty entries.`);
    }
    if (question.followUpQuestions.length !== 3) errors.push(`${owner}: exactly three follow-up questions are required.`);
    for (const [index, followUp] of question.followUpQuestions.entries()) {
      if (!followUp.question.trim() || !followUp.answer.trim()) {
        errors.push(`${owner}: follow-up ${index + 1} is missing a question or answer.`);
      }
    }
    if (question.tags.length === 0 || question.tags.some((tag) => !tag.trim())) errors.push(`${owner}: at least one non-empty tag is required.`);
    if (!Number.isInteger(question.estimatedReadingTime) || question.estimatedReadingTime < 1) {
      errors.push(`${owner}: estimatedReadingTime must be a positive integer.`);
    }
    if (question.relatedQuestionIds.length < 1) errors.push(`${owner}: at least one related question is required.`);
    addUniqueValue(question.id, questionIds, errors, "id", owner);
    addUniqueValue(question.slug, questionSlugs, errors, "slug", owner);
    questionById.set(question.id, question);
  }

  for (const technology of dataset.technologies) {
    for (const category of technology.categories) {
      for (const questionId of category.questionIds) {
        const question = questionById.get(questionId);
        if (!question) errors.push(`Category "${category.id}": unknown question id "${questionId}".`);
        else if (question.categoryId !== category.id) {
          errors.push(`Category "${category.id}": question "${questionId}" points to category "${question.categoryId}".`);
        }
      }
    }
  }

  for (const question of dataset.questions) {
    for (const relatedId of question.relatedQuestionIds) {
      if (!questionById.has(relatedId)) errors.push(`Question "${question.id}": unknown related question id "${relatedId}".`);
      if (relatedId === question.id) errors.push(`Question "${question.id}": a question cannot be related to itself.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
