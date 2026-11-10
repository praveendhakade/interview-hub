import type { Category } from "../../types/technology";
import { advancedQuestions } from "./advanced";
import { architectureQuestions } from "./architecture";
import { fundamentalsQuestions } from "./fundamentals";
import { hooksQuestions } from "./hooks";

export { advancedQuestions, architectureQuestions, fundamentalsQuestions, hooksQuestions };

export const reactCategories: readonly Category[] = [
  {
    id: "fundamentals",
    title: "React Fundamentals",
    slug: "fundamentals",
    description: "Core React concepts, JSX, state, props, lists, and Hooks foundations.",
    technologyId: "react",
    questionIds: fundamentalsQuestions.map((question) => question.id),
  },
  {
    id: "hooks",
    title: "React Hooks Deep Dive",
    slug: "hooks",
    description: "State, effects, refs, memoization, reducers, and the built-in Hooks model.",
    technologyId: "react",
    questionIds: hooksQuestions.map((question) => question.id),
  },
  {
    id: "advanced",
    title: "Advanced React Concepts",
    slug: "advanced",
    description: "Component identity, error recovery, hydration, portals, and application quality.",
    technologyId: "react",
    questionIds: advancedQuestions.map((question) => question.id),
  },
  {
    id: "architecture",
    title: "React Architecture & Optimization",
    slug: "architecture-optimization",
    description: "Data flow, loading, rendering strategies, composition, and performance boundaries.",
    technologyId: "react",
    questionIds: architectureQuestions.map((question) => question.id),
  },
];

export const reactQuestions = [
  ...fundamentalsQuestions,
  ...hooksQuestions,
  ...advancedQuestions,
  ...architectureQuestions,
] as const;
