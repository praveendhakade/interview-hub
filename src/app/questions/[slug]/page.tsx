import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionsLayout } from "@/components/questions/questions-layout";
import { QuestionDetail } from "@/components/questions/question-detail";
import { getAllQuestions, getQuestionBySlug } from "@/lib/content";
import { getQuestionUrl } from "@/lib/question-browsing";
import { createPageMetadata, createQuestionDescription } from "@/lib/seo";

export function generateStaticParams() {
  return getAllQuestions().map((question) => ({ slug: question.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) return { title: "Question not found" };
  const description = createQuestionDescription(question.title, question.shortAnswer);
  const path = getQuestionUrl(question.slug);
  return createPageMetadata({
    title: question.title,
    description,
    path,
    type: "article",
    image: "/social-image.png",
  });
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();
  return <QuestionsLayout><QuestionDetail question={question} /></QuestionsLayout>;
}
