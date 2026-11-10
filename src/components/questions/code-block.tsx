import { codeToHtml } from "shiki";
import { CodeCopyButton } from "./code-copy-button";

type HighlightLanguage = "typescript" | "tsx" | "javascript" | "jsx" | "json" | "css" | "bash";
const languageMap: Record<string, HighlightLanguage> = {
  typescript: "typescript",
  tsx: "tsx",
  javascript: "javascript",
  jsx: "jsx",
  json: "json",
  css: "css",
  bash: "bash",
};

export async function CodeBlock({ title, language, code, explanation }: {
  title: string;
  language: string;
  code: string;
  explanation: string;
}) {
  const supportedLanguage = languageMap[language.toLowerCase()] ?? "typescript";
  const highlightedCode = (await codeToHtml(code, { lang: supportedLanguage, theme: "github-dark" }))
    .replace("<pre", `<pre tabindex="0" aria-label="${title.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")} code example"`);

  return (
    <figure className="code-example surface-card">
      <figcaption className="code-example-heading">
        <div><strong>{title}</strong><span className="code-language">{supportedLanguage}</span></div>
        <CodeCopyButton code={code} />
      </figcaption>
      <div className="code-highlight" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      <p className="code-explanation">{explanation}</p>
    </figure>
  );
}
