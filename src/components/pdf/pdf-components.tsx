import { Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { join } from "node:path";
import type { Category } from "@/types/technology";
import type { CodeExample, InterviewQuestion } from "@/types/question";
import { getCategoryById } from "@/lib/content";

const fontFiles = join(process.cwd(), "node_modules", "@fontsource", "inter", "files");
const monoFiles = join(process.cwd(), "node_modules", "@fontsource", "roboto-mono", "files");
Font.register({
  family: "HubSans",
  fonts: [
    { src: join(fontFiles, "inter-latin-400-normal.woff"), fontWeight: 400 },
    { src: join(fontFiles, "inter-latin-700-normal.woff"), fontWeight: 700 },
  ],
});
Font.register({
  family: "HubMono",
  fonts: [{ src: join(monoFiles, "roboto-mono-latin-400-normal.woff"), fontWeight: 400 }],
});

const colors = {
  navy: "#17182f",
  ink: "#22243a",
  muted: "#62677b",
  accent: "#514fc5",
  accentPale: "#f0efff",
  border: "#dfe1eb",
  paper: "#ffffff",
  wash: "#f6f7fb",
  code: "#151725",
  codeInk: "#f1f2f9",
};

const keepWordsIntact = (word: string) => [word];

const styles = StyleSheet.create({
  cover: { padding: 0, backgroundColor: colors.navy, color: colors.paper, fontFamily: "HubSans" },
  coverTop: { height: 15, backgroundColor: colors.accent },
  coverContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 58, paddingVertical: 70 },
  brand: { color: "#c7c6ff", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 44 },
  coverKicker: { color: "#bdbbff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginBottom: 18, textTransform: "uppercase" },
  coverTitle: { maxWidth: 430, color: colors.paper, fontSize: 33, fontWeight: 700, lineHeight: 1.17, marginBottom: 20 },
  coverSubtitle: { maxWidth: 430, color: "#d4d5e4", fontSize: 12, lineHeight: 1.7 },
  coverRule: { width: 54, height: 4, borderRadius: 2, backgroundColor: "#a8a5ff", marginTop: 34, marginBottom: 18 },
  coverCount: { color: "#e4e4f0", fontSize: 10 },
  coverBottom: { height: 82, paddingHorizontal: 58, paddingVertical: 25, backgroundColor: "#20213b", justifyContent: "center" },
  coverFooter: { color: "#c4c5d6", fontSize: 9 },
  page: { paddingTop: 57, paddingBottom: 56, paddingHorizontal: 52, backgroundColor: colors.paper, color: colors.ink, fontFamily: "HubSans", fontSize: 10, lineHeight: 1.55 },
  header: { position: "absolute", top: 24, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between", paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBrand: { color: colors.navy, fontSize: 8, fontWeight: 700, letterSpacing: 0.5 },
  headerLabel: { color: colors.muted, fontSize: 8 },
  footerRule: { position: "absolute", bottom: 43, left: 52, right: 52, borderTopWidth: 1, borderTopColor: colors.border },
  footerText: { position: "absolute", bottom: 24, left: 52, color: colors.muted, fontSize: 8 },
  footerPage: { position: "absolute", bottom: 24, right: 52, color: colors.muted, fontSize: 8, textAlign: "right" },
  tocTitle: { color: colors.navy, fontSize: 23, fontWeight: 700, marginBottom: 6 },
  tocSubtitle: { color: colors.muted, fontSize: 9, marginBottom: 23 },
  tocCategory: { color: colors.accent, fontSize: 9, fontWeight: 700, marginTop: 14, marginBottom: 5 },
  tocRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  tocNumber: { width: 28, color: colors.muted, fontSize: 8 },
  tocLink: { flexGrow: 1, color: colors.ink, fontSize: 9, textDecoration: "none" },
  questionTitle: { color: colors.navy, fontSize: 21, fontWeight: 700, lineHeight: 1.2, marginBottom: 9 },
  questionMeta: { flexDirection: "row", gap: 14, paddingBottom: 14, marginBottom: 17, borderBottomWidth: 1, borderBottomColor: colors.border },
  metaText: { color: colors.muted, fontSize: 8 },
  sectionHeading: { color: colors.accent, fontSize: 11, fontWeight: 700, marginTop: 17, marginBottom: 7 },
  paragraph: { color: colors.ink, fontSize: 9.5, lineHeight: 1.65, marginBottom: 7 },
  listItem: { flexDirection: "row", marginBottom: 5, paddingLeft: 3 },
  listBullet: { width: 14, color: colors.accent, fontSize: 9, fontWeight: 700 },
  listText: { flexGrow: 1, color: colors.ink, fontSize: 9, lineHeight: 1.5 },
  codeBox: { marginTop: 4, marginBottom: 8, borderRadius: 5, backgroundColor: colors.code, padding: 10 },
  codeGroup: { marginTop: 4, marginBottom: 7 },
  codeTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: "#45485c" },
  codeTitle: { color: "#ffffff", fontSize: 8, fontWeight: 700 },
  codeLanguage: { color: "#b6b9cf", fontSize: 7, textTransform: "uppercase" },
  codeText: { color: colors.codeInk, fontFamily: "HubMono", fontSize: 8, lineHeight: 1.45 },
  codeExplanation: { color: colors.ink, fontSize: 8.7, lineHeight: 1.55, marginTop: 4, marginBottom: 7 },
  followUp: { padding: 9, marginBottom: 7, borderWidth: 0.7, borderColor: colors.border, borderRadius: 4, backgroundColor: colors.wash },
  followQuestion: { color: colors.navy, fontSize: 9, fontWeight: 700, marginBottom: 4 },
  followAnswer: { color: colors.ink, fontSize: 8.7, lineHeight: 1.5 },
});

export function PDFPageNumber() {
  return <Text fixed style={styles.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />;
}

export function PDFHeader({ label }: { label: string }) {
  return <View fixed style={styles.header}><Text style={styles.headerBrand}>REACT INTERVIEW HUB</Text><Text style={styles.headerLabel}>{label}</Text></View>;
}

export function PDFFooter() {
  return <><View fixed style={styles.footerRule} /><Text fixed style={styles.footerText}>Practical React interview preparation</Text><PDFPageNumber /></>;
}

export function PDFCoverPage({ title, subtitle, questionCount, kind }: { title: string; subtitle: string; questionCount: number; kind: "question" | "collection" | "complete" }) {
  const kindLabel = kind === "question" ? "Individual question guide" : kind === "complete" ? "Complete interview guide" : "React topic collection";
  return (
    <Page size="A4" style={styles.cover}>
      <View style={styles.coverTop} />
      <View style={styles.coverContent}>
        <Text style={styles.brand}>React Interview Hub</Text>
        <Text style={styles.coverKicker}>{kindLabel}</Text>
        <Text hyphenationCallback={keepWordsIntact} style={styles.coverTitle}>{title}</Text>
        <Text style={styles.coverSubtitle}>{subtitle}</Text>
        <View style={styles.coverRule} />
        <Text style={styles.coverCount}>{questionCount} {questionCount === 1 ? "interview question" : "interview questions"}</Text>
      </View>
      <View style={styles.coverBottom}><Text style={styles.coverFooter}>Thoughtful explanations · practical examples · clear takeaways</Text></View>
    </Page>
  );
}

export function PDFTableOfContents({ questions, categories, title }: { questions: readonly InterviewQuestion[]; categories: readonly Category[]; title: string }) {
  const grouped = categories.length > 1;
  const groupedQuestions = categories.map((category) => ({
    category,
    questions: questions.filter((question) => question.categoryId === category.id),
  })).filter((group) => group.questions.length > 0);
  const orderedQuestions = groupedQuestions.flatMap((group) => group.questions);
  const questionNumbers = new Map(orderedQuestions.map((question, index) => [question.id, index + 1]));
  return (
    <Page size="A4" style={styles.page} wrap>
      <PDFHeader label={title} /><PDFFooter />
      <Text style={styles.tocTitle}>Contents</Text>
      <Text style={styles.tocSubtitle}>{questions.length} questions · Select a title to jump to that section.</Text>
      {groupedQuestions.map(({ category, questions: groupQuestions }) => {
        return (
          <View key={category.id}>
            {grouped && <Text style={styles.tocCategory}>{category.title}</Text>}
            {groupQuestions.map((question) => (
              <View key={question.id} style={styles.tocRow}>
                <Text style={styles.tocNumber}>{String(questionNumbers.get(question.id) ?? 0).padStart(2, "0")}</Text>
                <Link src={`#question-${question.id}`} style={styles.tocLink}>{question.title}</Link>
              </View>
            ))}
          </View>
        );
      })}
    </Page>
  );
}

export function PDFSectionHeading({ children }: { children: string }) {
  return <Text minPresenceAhead={32} style={styles.sectionHeading}>{children}</Text>;
}

function PDFList({ items }: { items: readonly string[] }) {
  return <View>{items.map((item, index) => <View key={`${index}-${item}`} style={styles.listItem}><Text style={styles.listBullet}>•</Text><Text style={styles.listText}>{item}</Text></View>)}</View>;
}

function wrapCodeLines(code: string, maxLineLength = 86): string {
  return code.split("\n").flatMap((line) => {
    if (line.length <= maxLineLength) return [line];
    const chunks: string[] = [];
    for (let index = 0; index < line.length; index += maxLineLength) chunks.push(line.slice(index, index + maxLineLength));
    return chunks;
  }).join("\n");
}

export function PDFCodeBlock({ example }: { example: CodeExample }) {
  return (
    <View style={styles.codeGroup}>
      <View style={styles.codeBox}>
        <View style={styles.codeTop}><Text style={styles.codeTitle}>{example.title}</Text><Text style={styles.codeLanguage}>{example.language}</Text></View>
        <Text hyphenationCallback={keepWordsIntact} style={styles.codeText}>{wrapCodeLines(example.code)}</Text>
      </View>
      <Text style={styles.codeExplanation}>{example.explanation}</Text>
    </View>
  );
}

function PDFParagraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <Text key={index} style={styles.paragraph}>{paragraph}</Text>)}</>;
}

export function PDFQuestionSection({ question }: { question: InterviewQuestion }) {
  const category = getCategoryById(question.categoryId);
  return (
    <View>
      <Text hyphenationCallback={keepWordsIntact} id={`question-${question.id}`} style={styles.questionTitle}>{question.title}</Text>
      <View style={styles.questionMeta}>
        <Text style={styles.metaText}>Difficulty: {question.difficulty}</Text>
        <Text style={styles.metaText}>{question.estimatedReadingTime} min read</Text>
        {category && <Text style={styles.metaText}>{category.title}</Text>}
      </View>
      <PDFSectionHeading>Short interview answer</PDFSectionHeading>
      <PDFParagraphs text={question.shortAnswer} />
      <PDFSectionHeading>Detailed explanation</PDFSectionHeading>
      <PDFParagraphs text={question.detailedAnswer} />
      {question.keyPoints.length > 0 && <><PDFSectionHeading>Key points</PDFSectionHeading><PDFList items={question.keyPoints} /></>}
      {question.codeExamples.length > 0 && <>
        <PDFSectionHeading>Code examples</PDFSectionHeading>
        {question.codeExamples.map((example, index) => <PDFCodeBlock example={example} key={`${question.id}-code-${index}`} />)}
      </>}
      {question.realWorldUseCases.length > 0 && <><PDFSectionHeading>Real-world use cases</PDFSectionHeading><PDFList items={question.realWorldUseCases} /></>}
      {question.commonMistakes.length > 0 && <><PDFSectionHeading>Common mistakes</PDFSectionHeading><PDFList items={question.commonMistakes} /></>}
      {question.followUpQuestions.length > 0 && <>
        <PDFSectionHeading>Interview follow-up questions</PDFSectionHeading>
        {question.followUpQuestions.map((followUp, index) => <View key={`${question.id}-follow-${index}`} style={styles.followUp}>
          <Text style={styles.followQuestion}>{followUp.question}</Text><Text style={styles.followAnswer}>{followUp.answer}</Text>
        </View>)}
      </>}
    </View>
  );
}

export function PDFQuestionPage({ question, label }: { question: InterviewQuestion; label: string }) {
  return (
    <Page bookmark={{ title: question.title, fit: true }} size="A4" style={styles.page} wrap>
      <PDFHeader label={label} /><PDFFooter />
      <PDFQuestionSection question={question} />
    </Page>
  );
}

