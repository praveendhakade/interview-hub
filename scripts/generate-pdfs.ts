import { createElement } from "react";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { PDFDocument } from "../src/components/pdf/pdf-document";
import { validateContent } from "../src/lib/content-validation";
import { createPdfManifest } from "../src/lib/pdf-resources";

const outputDirectory = join(process.cwd(), "public", "downloads");

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

async function removeObsoleteGeneratedFiles(expectedFiles: ReadonlySet<string>) {
  const existingFiles = await readdir(outputDirectory);
  const generatedName = /^(?:react-question-[a-z0-9-]+|react-(?:fundamentals|hooks|advanced|architecture-optimization)|react-interview-preparation-guide)\.pdf$/;
  for (const fileName of existingFiles) {
    if (generatedName.test(fileName) && !expectedFiles.has(fileName)) {
      await unlink(join(outputDirectory, fileName));
    }
  }
}

async function main() {
  const validation = validateContent();
  if (!validation.valid) {
    throw new Error(`Question content is invalid:\n${validation.errors.map((error) => `- ${error}`).join("\n")}`);
  }

  const manifest = createPdfManifest();
  await mkdir(outputDirectory, { recursive: true });
  const expectedFiles = new Set(manifest.map((target) => target.fileName));
  await removeObsoleteGeneratedFiles(expectedFiles);

  console.info(`Generating ${manifest.length} PDF files in ${outputDirectory}`);
  for (const target of manifest) {
    const filePath = join(outputDirectory, target.fileName);
    const documentKind = target.kind === "category" ? "collection" : target.kind;
    const document = createElement(PDFDocument, { ...target, kind: documentKind });
    await renderToFile(document as Parameters<typeof renderToFile>[0], filePath);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile() || fileStats.size === 0) throw new Error(`PDF output is missing or empty: ${target.fileName}`);
    console.info(`✓ ${target.fileName} (${formatSize(fileStats.size)})`);
  }

  const generatedFiles = await readdir(outputDirectory);
  const missing = [...expectedFiles].filter((fileName) => !generatedFiles.includes(fileName));
  if (missing.length) throw new Error(`PDF generation incomplete. Missing: ${missing.join(", ")}`);
  console.info(`PDF generation complete: ${expectedFiles.size} files verified.`);
}

main().catch((error: unknown) => {
  console.error("PDF generation failed:");
  console.error(error);
  process.exitCode = 1;
});
