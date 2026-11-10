"use client";

import { useState } from "react";

export function CodeCopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className="code-copy-control">
      <button aria-label="Copy code" className="code-copy-button" onClick={copyCode} type="button">
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}
      </button>
      <span aria-live="polite" className="visually-hidden">
        {status === "copied" ? "Code copied to clipboard." : status === "failed" ? "Unable to copy code. Select it and copy manually." : ""}
      </span>
    </span>
  );
}
