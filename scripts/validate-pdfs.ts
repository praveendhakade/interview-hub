import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { createPdfManifest, getPdfDownloadUrl } from "../src/lib/pdf-resources";

const outputDirectory = join(process.cwd(), "public", "downloads");

function normalizeExtractedText(text: string): string {
  return text.replace(/-\s*\n/g, "").replace(/\s+/g, " ").trim();
}

async function extractText(filePath: string): Promise<string> {
  const bytes = await readFile(filePath);
  const parser = new PDFParse({ data: new Uint8Array(bytes) });
  try {
    const result = await parser.getText();
    if (!result.text.trim()) throw new Error(`No extractable text found in ${filePath}.`);
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function main() {
  const manifest = createPdfManifest();
  const expected = new Set(manifest.map((target) => target.fileName));
  const existing = await readdir(outputDirectory);
  const actualPdfs = existing.filter((fileName) => fileName.endsWith(".pdf"));
  if (actualPdfs.length !== expected.size) {
    throw new Error(`Expected ${expected.size} PDFs, found ${actualPdfs.length}.`);
  }

  let totalBytes = 0;
  for (const target of manifest) {
    const filePath = join(outputDirectory, target.fileName);
    if (!existing.includes(target.fileName)) throw new Error(`Missing PDF: ${target.fileName}`);
    const [fileStats, bytes] = await Promise.all([stat(filePath), readFile(filePath)]);
    if (!fileStats.isFile() || fileStats.size < 100 || bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new Error(`Invalid or empty PDF file: ${target.fileName}`);
    }
    totalBytes += fileStats.size;
    if (getPdfDownloadUrl(target.fileName) !== `/downloads/${target.fileName}`) {
      throw new Error(`Invalid download URL for ${target.fileName}`);
    }
    const text = normalizeExtractedText(await extractText(filePath));
    const expectedTitle = target.kind === "complete" ? target.questions[0]?.title : target.title;
    if (!expectedTitle || !text.includes(normalizeExtractedText(expectedTitle))) {
      throw new Error(`Extracted text did not contain expected title for ${target.fileName}.`);
    }
  }

  console.info(`PDF validation passed: ${expected.size} files, ${(totalBytes / (1024 * 1024)).toFixed(2)} MB total.`);
  console.info("Opened and extracted text from all generated PDFs.");
}

main().catch((error: unknown) => {
  console.error("PDF validation failed:");
  console.error(error);
  process.exitCode = 1;
});
