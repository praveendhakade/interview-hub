export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CodeExample = {
  title: string;
  language: "tsx" | "typescript" | "jsx" | "javascript" | "json" | "css" | "bash";
  code: string;
  explanation: string;
};

export type FollowUpQuestion = {
  question: string;
  answer: string;
};

export type InterviewQuestion = {
  id: string;
  slug: string;
  title: string;
  shortAnswer: string;
  detailedAnswer: string;
  keyPoints: readonly string[];
  codeExamples: readonly CodeExample[];
  realWorldUseCases: readonly string[];
  commonMistakes: readonly string[];
  followUpQuestions: readonly FollowUpQuestion[];
  difficulty: Difficulty;
  categoryId: string;
  technologyId: string;
  tags: readonly string[];
  estimatedReadingTime: number;
  relatedQuestionIds: readonly string[];
  instagramReelUrl?: string;
};
