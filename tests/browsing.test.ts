import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryNavigation } from "../src/components/questions/category-navigation";
import { CodeCopyButton } from "../src/components/questions/code-copy-button";
import { QuestionCard } from "../src/components/questions/question-card";
import { QuestionToc } from "../src/components/questions/question-toc";
import { QuestionList } from "../src/components/questions/question-list";
import { RelatedQuestions } from "../src/components/questions/related-questions";
import { getAllCategories, getAllQuestions, getQuestionBySlug, getRelatedQuestions } from "../src/lib/content";
import { getCategoryUrl, getFilteredQuestions, getQuestionUrl } from "../src/lib/question-browsing";

afterEach(() => cleanup());

describe("question browsing", () => {
  it("lists all questions and resolves every static question route", () => {
    const questions = getFilteredQuestions({});
    assert.equal(questions.length, 40);
    assert.ok(questions.every((question) => getQuestionBySlug(question.slug) === question));
  });

  it("searches content and combines category and difficulty filters", () => {
    const results = getFilteredQuestions({ query: "useMemo", categoryId: "hooks", difficulty: "intermediate" });
    assert.ok(results.length > 0);
    assert.ok(results.every((question) => question.categoryId === "hooks" && question.difficulty === "intermediate"));
    assert.ok(results.some((question) => question.id === "when-to-use-usememo"));
  });

  it("returns an empty set for unmatched filters", () => {
    assert.deepEqual(getFilteredQuestions({ query: "no-such-question" }), []);
    render(createElement(QuestionList, { questions: [] }));
    assert.ok(screen.getByRole("status").textContent?.includes("No questions found"));
  });

  it("renders question summaries and the answer route", () => {
    const question = getAllQuestions()[0];
    render(createElement(QuestionCard, { question }));
    assert.ok(screen.getByRole("heading", { name: question.title }));
    assert.ok(screen.getByText(question.shortAnswer));
    assert.equal(screen.getByRole("link", { name: /view answer/i }).getAttribute("href"), `/questions/${question.slug}`);
  });

  it("handles invalid question slugs and generates stable route paths", () => {
    assert.equal(getQuestionBySlug("not-a-question"), undefined);
    assert.equal(getQuestionUrl("what-is-react"), "/questions/what-is-react");
    assert.equal(getCategoryUrl("architecture"), "/react/architecture-optimization");
    assert.equal(getCategoryUrl("missing"), "/react");
  });

  it("renders category navigation links to the existing category slugs", () => {
    render(createElement(CategoryNavigation, { categories: getAllCategories(), activeCategoryId: "hooks" }));
    const navigation = screen.getByRole("navigation", { name: "React question categories" });
    assert.equal(navigation.querySelectorAll("a").length, 5);
    assert.equal(screen.getByRole("link", { name: "React Hooks Deep Dive" }).getAttribute("href"), "/react/hooks");
    assert.equal(screen.getByRole("link", { name: "React Hooks Deep Dive" }).getAttribute("aria-current"), "page");
  });

  it("renders related question links from the declared relationships", () => {
    const question = getAllQuestions()[0];
    const related = getRelatedQuestions(question.id);
    render(createElement(RelatedQuestions, { questions: related }));
    for (const item of related) {
      assert.ok(screen.getByRole("link", { name: item.title }));
      assert.equal(screen.getByRole("link", { name: item.title }).getAttribute("href"), `/questions/${item.slug}`);
    }
  });

  it("renders the table of contents as a native disclosure with section links", () => {
    render(createElement(QuestionToc, { entries: [{ id: "explanation", label: "Explanation" }] }));
    assert.ok(screen.getByText("On this page"));
    assert.equal(screen.getByRole("link", { name: "Explanation" }).getAttribute("href"), "#explanation");
    assert.ok(screen.getByRole("navigation", { name: "Question contents" }));
  });

  it("copies code through the accessible copy button", async () => {
    let copiedText = "";
    const writeText = async (text: string) => { copiedText = text; };
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(createElement(CodeCopyButton, { code: "const answer = 42;" }));
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    assert.equal(screen.getByRole("button", { name: "Copy code" }).textContent, "Copied");
    assert.equal(copiedText, "const answer = 42;");
    assert.equal(screen.getByText("Code copied to clipboard.").getAttribute("aria-live"), "polite");
  });
});
