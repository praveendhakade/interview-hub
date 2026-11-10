import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "node:test";
import { PDFParse } from "pdf-parse";
import { getAllCategories, getAllQuestions, getAllTechnologies } from "../src/lib/content";
import { validateContent } from "../src/lib/content-validation";
import {
  COMPLETE_GUIDE_FILENAME,
  createPdfManifest,
  getCategoryPdfFilename,
  getPdfDownloadUrl,
  getQuestionPdfFilename,
} from "../src/lib/pdf-resources";

const downloadDirectory = join(process.cwd(), "public", "downloads");

function normalizeExtractedText(text: string): string {
  return text.replace(/-\s*\n/g, "").replace(/\s+/g, " ").trim();
}

describe("PDF manifest and downloads", () => {
  const manifest = createPdfManifest();

  it("plans 40 individual, four category, and one complete PDF", () => {
    assert.equal(manifest.length, 45);
    assert.equal(manifest.filter((item) => item.kind === "question").length, getAllQuestions().length);
    assert.equal(manifest.filter((item) => item.kind === "category").length, getAllCategories().length);
    assert.equal(manifest.filter((item) => item.kind === "complete").length, 1);
  });

  it("builds stable filenames and direct public download URLs", () => {
    assert.equal(getQuestionPdfFilename("what-is-react"), "react-question-what-is-react.pdf");
    assert.equal(getCategoryPdfFilename("fundamentals"), "react-fundamentals.pdf");
    assert.equal(COMPLETE_GUIDE_FILENAME, "react-interview-preparation-guide.pdf");
    assert.equal(getPdfDownloadUrl(COMPLETE_GUIDE_FILENAME), "/downloads/react-interview-preparation-guide.pdf");
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

  it("verifies all expected files exist and have non-empty PDF signatures", async () => {
    assert.equal(manifest.length, 45);
    const actualFiles = (await readdir(downloadDirectory)).filter((name) => name.endsWith(".pdf")).sort();
    assert.deepEqual(actualFiles, manifest.map((target) => target.fileName).sort());
    for (const target of manifest) {
      const filePath = join(downloadDirectory, target.fileName);
      const [fileStats, bytes] = await Promise.all([stat(filePath), readFile(filePath)]);
      assert.ok(fileStats.size > 100, `${target.fileName} should be non-empty`);
      assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-");
    }
  });

  it("parses individual, category, and complete PDFs and finds their text", async () => {
    for (const target of [manifest[0], manifest[getAllQuestions().length], manifest.at(-1)!]) {
      const filePath = join(downloadDirectory, target.fileName);
      const bytes = await readFile(filePath);

      const parser = new PDFParse({ data: new Uint8Array(bytes) });
      try {
        const extracted = await parser.getText();
        const expectedTitle = target.kind === "complete" ? target.questions[0]?.title : target.title;
        assert.ok(expectedTitle && normalizeExtractedText(extracted.text).includes(normalizeExtractedText(expectedTitle)));
      } finally {
        await parser.destroy();
      }
    }
  });
});
