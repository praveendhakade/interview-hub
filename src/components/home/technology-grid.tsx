import Link from "next/link";
import { TechnologyIcon, Icon } from "@/components/common/icon";
import { Badge, Container, Eyebrow } from "@/components/common/ui";
import { getAllTechnologies } from "@/lib/content";

export function TechnologyGrid() {
  return (
    <section aria-labelledby="technology-title" className="section technology-section" id="technologies">
      <Container>
        <div className="section-heading">
          <Eyebrow>Choose your next topic</Eyebrow>
          <h2 id="technology-title">One place to sharpen your skills.</h2>
          <p className="section-description">
            Start with React, then follow your curiosity as new learning tracks arrive.
          </p>
        </div>

        <div className="technology-grid">
          {getAllTechnologies().map((technology) => {
            const content = (
              <>
                <div className="technology-card-top">
                  <span className="technology-icon">
                    <TechnologyIcon name={technology.icon} />
                  </span>
                  {technology.status === "available"
                    ? <Icon className="technology-card-arrow" name="arrow-up-right" />
                    : <Badge variant="upcoming">Coming Soon</Badge>}
                </div>
                <h3>{technology.name}</h3>
                <p>{technology.description}</p>
                {technology.status === "available" && <Badge variant="available">Available</Badge>}
              </>
            );

            return technology.status === "available" ? (
              <Link className="technology-card" href="/react" key={technology.id}>
                {content}
              </Link>
            ) : (
              <article className="technology-card" key={technology.id}>
                {content}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
