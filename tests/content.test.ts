import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAllQuestions,
  getAllTechnologies,
  getQuestionById,
  getQuestionBySlug,
  getQuestionCountByCategory,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getQuestionsByTechnology,
  getRelatedQuestions,
  searchQuestions,
  getTechnologyBySlug,
} from "../src/lib/content";
import { validateContent } from "../src/lib/content-validation";

describe("content utilities", () => {
  it("exposes all 40 questions through a stable lookup", () => {
    const questions = getAllQuestions();
    assert.equal(questions.length, 40);
    assert.ok(questions.every((question) => getQuestionById(question.id) === question));
  });

  it("looks up questions and technologies by slug", () => {
    assert.equal(getQuestionBySlug("what-is-react")?.id, "react-what-is-react");
    assert.equal(getQuestionBySlug("missing"), undefined);
    assert.equal(getTechnologyBySlug("react")?.id, "react");
    assert.equal(getTechnologyBySlug("missing"), undefined);
    assert.equal(getAllTechnologies().length, 6);
  });

  it("filters questions by category and technology", () => {
    assert.equal(getQuestionsByCategory("fundamentals").length, 10);
    assert.equal(getQuestionsByCategory("unknown").length, 0);
    assert.equal(getQuestionsByTechnology("react").length, 40);
    assert.equal(getQuestionsByTechnology("javascript").length, 0);
    assert.equal(getQuestionCountByCategory("hooks"), 10);
  });

  it("filters by difficulty", () => {
    const advanced = getQuestionsByDifficulty("advanced");
    assert.ok(advanced.length > 0);
    assert.ok(advanced.every((question) => question.difficulty === "advanced"));
  });

  it("resolves only the related questions declared by a question", () => {
    const question = getQuestionById("react-what-is-react");
    assert.ok(question);
    assert.deepEqual(
      getRelatedQuestions(question.id).map((related) => related.id),
      [...question.relatedQuestionIds],
    );
    assert.deepEqual(getRelatedQuestions("missing"), []);
  });

  it("searches titles, explanations and tags without case sensitivity", () => {
    assert.ok(searchQuestions("hydration").some((question) => question.id === "react-hydration"));
    assert.ok(searchQuestions("USEMEMO").some((question) => question.id === "when-to-use-usememo"));
    assert.deepEqual(searchQuestions("   "), getAllQuestions());
  });
});

describe("content validation", () => {
  it("accepts the complete question bank", () => {
    assert.deepEqual(validateContent(), { valid: true, errors: [] });
  });

  it("reports missing answers, duplicate identifiers and invalid references", () => {
    const questions = getAllQuestions().map((question) => ({ ...question }));
    questions[0] = {
      ...questions[0],
      slug: questions[1].slug,
      shortAnswer: "",
      relatedQuestionIds: ["does-not-exist"],
    };
    const result = validateContent({ questions, technologies: getAllTechnologies() });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("duplicate slug")));
    assert.ok(result.errors.some((error) => error.includes("shortAnswer")));
    assert.ok(result.errors.some((error) => error.includes("unknown related question id")));
  });
});
