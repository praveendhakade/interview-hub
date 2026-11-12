import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllCategories, getAllQuestions, getAllTechnologies } from "../src/lib/content";
import { validateContent } from "../src/lib/content-validation";
import {
  COMPLETE_GUIDE_FILENAME,
  createPdfManifest,
  getCategoryPdfFilename,
  getPdfDownloadUrl,
  getQuestionPdfFilename,
} from "../src/lib/pdf-resources";

describe("PDF manifest and downloads", () => {
  const manifest = createPdfManifest();

  it("plans 40 individual, four category, and one complete PDF", () => {
    assert.equal(manifest.length, 45);
    assert.equal(manifest.filter((item) => item.kind === "question").length, getAllQuestions().length);
    assert.equal(manifest.filter((item) => item.kind === "category").length, getAllCategories().length);
    assert.equal(manifest.filter((item) => item.kind === "complete").length, 1);
  });

  it("builds stable filenames and on-demand download URLs", () => {
    assert.equal(getQuestionPdfFilename("what-is-react"), "react-question-what-is-react.pdf");
    assert.equal(getCategoryPdfFilename("fundamentals"), "react-fundamentals.pdf");
    assert.equal(COMPLETE_GUIDE_FILENAME, "react-interview-preparation-guide.pdf");
    assert.equal(getPdfDownloadUrl(COMPLETE_GUIDE_FILENAME), "/api/downloads/react-interview-preparation-guide.pdf");
    assert.throws(() => getPdfDownloadUrl("../private.pdf"), /Invalid PDF filename/);
  });

  it("rejects empty input and invalid category question references", () => {
    assert.throws(() => createPdfManifest([], getAllCategories()), /without questions/);
    assert.throws(() => createPdfManifest(getAllQuestions(), [{
      ...getAllCategories()[0], questionIds: ["missing-question"],
    }]), /references missing question/);
  });

  it("fails content validation when required question text is missing", () => {
    const questions = getAllQuestions().map((question) => ({ ...question }));
    questions[0] = { ...questions[0], detailedAnswer: "" };
    const result = validateContent({ questions, technologies: getAllTechnologies() });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("detailedAnswer")));
  });

});
