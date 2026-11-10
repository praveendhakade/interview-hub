export type AvailabilityStatus = "available" | "coming-soon";

export type TechnologyIconName =
  | "react"
  | "javascript"
  | "typescript"
  | "node"
  | "next"
  | "html-css";

export type Category = {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologyId: string;
  questionIds: readonly string[];
};

export type Technology = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: TechnologyIconName;
  status: AvailabilityStatus;
  categories: readonly Category[];
};
