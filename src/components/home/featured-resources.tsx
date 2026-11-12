import Link from "next/link";
import { Icon } from "@/components/common/icon";
import { Container, Eyebrow } from "@/components/common/ui";
import { getAllCategories, getQuestionCountByCategory } from "@/lib/content";
import { getCategoryPdfFilename, getPdfDownloadUrl } from "@/lib/pdf-resources";

const resourceIcons = ["book", "code", "sparkles", "layers"] as const;

export function FeaturedResources() {
  return (
    <section aria-labelledby="resources-title" className="section resource-section" id="featured-resources">
      <Container>
        <div className="section-heading">
          <Eyebrow>Start with React</Eyebrow>
          <h2 id="resources-title">Learn the concepts interviewers ask about.</h2>
          <p className="section-description">
            Explore focused collections designed to help you explain ideas with confidence.
          </p>
        </div>

        <div className="resource-grid">
          {getAllCategories().map((category, index) => (
            <article className="surface-card resource-card" key={category.id}>
              <span className="resource-icon"><Icon name={resourceIcons[index] ?? "book"} /></span>
              <h3><Link href={`/react/${category.slug}`}>{category.title}</Link></h3>
              <p>{category.description}</p>
              <span className="resource-label">{getQuestionCountByCategory(category.id)} interview questions</span>
              <a className="resource-download" href={getPdfDownloadUrl(getCategoryPdfFilename(category.slug))}>Download collection PDF</a>
            </article>
          ))}
        </div>

        <div className="guide-note" id="free-guide">
          <span className="resource-icon"><Icon name="gift" /></span>
          <div className="guide-note-copy">
            <strong>Your complete React interview guide.</strong>
            <span>Download all 40 questions and keep the full learning collection for offline study.</span>
          </div>
          <a className="button button-secondary guide-download" href={getPdfDownloadUrl("react-interview-preparation-guide.pdf")}><Icon name="download" />Download complete guide</a>
        </div>
      </Container>
    </section>
  );
}
