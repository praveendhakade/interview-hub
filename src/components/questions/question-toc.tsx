"use client";

import { useEffect, useState } from "react";

export type TocEntry = { id: string; label: string };

export function QuestionToc({ entries }: { entries: readonly TocEntry[] }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const sections = entries
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((observations) => {
      const visible = observations
        .filter((observation) => observation.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [entries]);

  const links = entries.map((entry) => (
    <a aria-current={activeId === entry.id ? "location" : undefined} href={`#${entry.id}`} key={entry.id}>
      {entry.label}
    </a>
  ));

  return (
    <details className="question-toc" open>
      <summary>On this page</summary>
      <nav aria-label="Question contents">{links}</nav>
    </details>
  );
}
