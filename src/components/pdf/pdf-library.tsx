import Link from "next/link";
import { Container, Eyebrow } from "@/components/common/ui";
import { getAllCategories, getAllQuestions } from "@/lib/content";
import { COMPLETE_GUIDE_FILENAME, getCategoryPdfFilename, getPdfDownloadUrl } from "@/lib/pdf-resources";

export function PDFLibrary() {
  const categories = getAllCategories();
  const questionCount = getAllQuestions().length;
  const guideUrl = getPdfDownloadUrl(COMPLETE_GUIDE_FILENAME);

  return (
    <section aria-labelledby="pdf-library-title" className="section pdf-library-section" id="pdf-library">
      <Container>
        <div className="section-heading">
          <Eyebrow>Study offline</Eyebrow>
          <h2 id="pdf-library-title">Printable React guides</h2>
          <p className="section-description">Download polished guides for offline reading. Each question also has its own PDF link on the question card and answer page.</p>
        </div>
        <div className="pdf-library-feature surface-card">
          <div>
            <span className="pdf-library-kicker">Complete collection</span>
            <h3>Complete React Interview Preparation Guide</h3>
            <p>All {questionCount} questions across {categories.length} categories, with answers, examples, use cases, and follow-ups.</p>
          </div>
          <a className="button button-primary" download href={guideUrl}>Download complete guide</a>
        </div>
        <div className="pdf-category-grid">
          {categories.map((category) => (
            <article className="surface-card pdf-category-card" key={category.id}>
              <span className="pdf-library-kicker">{category.questionIds.length} questions</span>
              <h3><Link href={`/react/${category.slug}`}>{category.title}</Link></h3>
              <p>{category.description}</p>
              <a className="text-link" download href={getPdfDownloadUrl(getCategoryPdfFilename(category.slug))}>Download topic PDF <span aria-hidden="true">↓</span></a>
            </article>
          ))}
        </div>
        <p className="pdf-download-note">PDFs are generated from the same question content used on this site. Save a file to read or print it offline.</p>
      </Container>
    </section>
  );
}
