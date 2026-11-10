import { Icon } from "@/components/common/icon";
import { Container, Eyebrow } from "@/components/common/ui";

const benefits = [
  {
    title: "Interview-ready explanations",
    description: "Clear answers that help you explain the concept in your own words.",
    icon: "book" as const,
  },
  {
    title: "Practical code examples",
    description: "Connect ideas to realistic code and everyday development work.",
    icon: "code" as const,
  },
  {
    title: "Topic-wise learning",
    description: "Move through focused collections at a pace that works for you.",
    icon: "layers" as const,
  },
  {
    title: "Free PDF downloads",
    description: "Take professionally formatted guides with you when they are available.",
    icon: "gift" as const,
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="about-title" className="section benefits-section" id="about">
      <Container>
        <div className="section-heading">
          <Eyebrow>A better way to prepare</Eyebrow>
          <h2 id="about-title">Build understanding that stays with you.</h2>
          <p className="section-description">
            More than quick definitions: a practical path from first principles to confident answers.
          </p>
        </div>

        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit.title}>
              <span className="resource-icon"><Icon name={benefit.icon} /></span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
