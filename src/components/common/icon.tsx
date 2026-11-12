import type { ReactNode, SVGProps } from "react";

type IconName =
  | "arrow-up-right"
  | "book"
  | "check"
  | "code"
    | "download"
  | "gift"
  | "github"
  | "instagram"
  | "linkedin"
  | "layers"
  | "menu"
  | "moon"
  | "sparkles"
  | "sun"
  | "close";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const iconPaths: Record<IconName, ReactNode> = {
  "arrow-up-right": <path d="M7 17 17 7M7 7h10v10" />,
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" />
      <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" />,
    download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18M12 8H8.5a2.5 2.5 0 1 1 2.4-3.2L12 8Zm0 0h3.5a2.5 2.5 0 1 0-2.4-3.2L12 8Z" />
    </>
  ),
  github: (
    <>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 0 0-1.4-3.7 4.9 4.9 0 0 0-.1-3.7S17.6.9 15 2.8a13.2 13.2 0 0 0-7 0C5.4.9 4.2 1.2 4.2 1.2a4.9 4.9 0 0 0-.1 3.7 5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.2 6.5 6.2 6.8A3.4 3.4 0 0 0 8 18v4" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7h.01M12 17v-4a3 3 0 0 1 6 0v4m-6-4v4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
  sparkles: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM5 2l.7 2.3L8 5l-2.3.7L5 8l-.7-2.3L2 5l2.3-.7L5 2Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}

type TechnologyIconProps = {
  name: "react" | "javascript" | "typescript" | "node" | "next" | "html-css";
};

export function TechnologyIcon({ name }: TechnologyIconProps) {
  if (name === "react") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 64 64">
        <g stroke="currentColor" strokeWidth="2.6">
          <ellipse cx="32" cy="32" rx="26" ry="10" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)" />
        </g>
        <circle cx="32" cy="32" r="4" fill="currentColor" />
      </svg>
    );
  }

  if (name === "javascript" || name === "typescript") {
    const isTypeScript = name === "typescript";
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <rect
          fill={isTypeScript ? "#3178c6" : "#f0d94f"}
          height="44"
          rx="7"
          width="44"
          x="2"
          y="2"
        />
        <text
          fill={isTypeScript ? "#ffffff" : "#242424"}
          fontFamily="Arial, sans-serif"
          fontSize="19"
          fontWeight="700"
          textAnchor="middle"
          x="24"
          y="32"
        >
          {isTypeScript ? "TS" : "JS"}
        </text>
      </svg>
    );
  }

  if (name === "node") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
        <path d="m24 3 18 10v21L24 45 6 34V13L24 3Z" fill="#438c68" />
        <path d="m17 17 7-4 7 4v13l-7 4-7-4V17Z" stroke="#fff" strokeWidth="2" />
        <path d="M21 21v9m6-9v9" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "next") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
        <path d="M15 33V15l18 19V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
      <path d="m24 3 19 10v22L24 45 5 35V13L24 3Z" fill="#e96947" />
      <path d="m16 15 2 20h12l2-20-8 3-8-3Z" fill="#fff" />
      <path d="M19 22h10m-9 5h8m-8 5h7" stroke="#e96947" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
