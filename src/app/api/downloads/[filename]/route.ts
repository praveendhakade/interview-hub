import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/pdf-document";
import { createPdfManifest } from "@/lib/pdf-resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  const target = createPdfManifest().find((item) => item.fileName === filename);
  if (!target) return Response.json({ error: "PDF not found" }, { status: 404 });

  const kind = target.kind === "question" ? "question" : target.kind === "complete" ? "complete" : "collection";
  const pdf = await renderToBuffer(createElement(PDFDocument, { ...target, kind }));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${target.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
