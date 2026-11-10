import type { Technology } from "../types/technology";
import { reactCategories } from "./react";

export const technologies: readonly Technology[] = [
  {
    id: "react",
    name: "React",
    slug: "react",
    description: "Build confidence with core React concepts and patterns.",
    icon: "react",
    status: "available",
    categories: reactCategories,
  },
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    description: "Language fundamentals, behavior, and modern syntax.",
    icon: "javascript",
    status: "coming-soon",
    categories: [],
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    description: "Types, tooling, and safer application design.",
    icon: "typescript",
    status: "coming-soon",
    categories: [],
  },
  {
    id: "nodejs",
    name: "Node.js",
    slug: "nodejs",
    description: "Runtime concepts, APIs, and backend fundamentals.",
    icon: "node",
    status: "coming-soon",
    categories: [],
  },
  {
    id: "nextjs",
    name: "Next.js",
    slug: "nextjs",
    description: "Rendering, routing, and full-stack web patterns.",
    icon: "next",
    status: "coming-soon",
    categories: [],
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    slug: "html-css",
    description: "Accessible structure and responsive styling.",
    icon: "html-css",
    status: "coming-soon",
    categories: [],
  },
];
