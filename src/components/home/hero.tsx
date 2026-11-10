import { Icon, TechnologyIcon } from "@/components/common/icon";
import { ButtonLink, Container, Eyebrow } from "@/components/common/ui";
import { siteConfig } from "@/config/site";

function HeroIllustration() {
  return (
    <div aria-hidden="true" className="hero-visual">
      <span className="orbit-dot orbit-react">
        <TechnologyIcon name="react" />
      </span>
      <span className="orbit-dot orbit-js">
        <TechnologyIcon name="javascript" />
      </span>
      <span className="orbit-dot orbit-check">
        <Icon name="check" />
      </span>

      <div className="code-window">
        <div className="code-window-bar">
          <span className="window-dot" />
          <span className="window-dot" />
          <span className="window-dot" />
          <span className="code-file-name">interview-ready.tsx</span>
        </div>
        <div className="code-content">
          <div><span className="code-line-number">01</span><span className="code-purple">import</span> {"{ useState }"} <span className="code-purple">from</span> <span className="code-green">"react"</span>;</div>
          <div><span className="code-line-number">02</span></div>
          <div><span className="code-line-number">03</span><span className="code-purple">function</span> <span className="code-blue">InterviewReady</span>() {"{"}</div>
          <div><span className="code-line-number">04</span>  <span className="code-purple">const</span> [answer, setAnswer] = <span className="code-blue">useState</span>(<span className="code-orange">""</span>);</div>
          <div><span className="code-line-number">05</span></div>
          <div><span className="code-line-number">06</span>  <span className="code-purple">return</span> &lt;<span className="code-blue">Answer</span> value={"{"}answer{"}"} /&gt;;</div>
          <div><span className="code-line-number">07</span>{"}"}</div>
        </div>
      </div>

      <div className="floating-note">
        <Icon name="sparkles" />
        <span>Understand the why</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero" id="home">
      <Container className="hero-grid">
        <div className="hero-copy">
          <Eyebrow>Thoughtful prep for your next big step</Eyebrow>
          <h1 id="hero-title">
            Crack Your Next <span className="accent-text">Developer Interview.</span>
          </h1>
          <p className="hero-description">{siteConfig.description}</p>
          <div className="hero-actions">
            <ButtonLink href="/react">Explore React Questions</ButtonLink>
            <ButtonLink download href="/downloads/react-interview-preparation-guide.pdf" variant="secondary">
              <Icon name="book" />
              Download Free Guide
            </ButtonLink>
          </div>
          <p className="hero-assurance">
            <span className="assurance-icon"><Icon name="check" /></span>
            Free learning resources, built around practical understanding.
          </p>
        </div>
        <HeroIllustration />
      </Container>
    </section>
  );
}
