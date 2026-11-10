import { Icon } from "@/components/common/icon";
import { Container, Eyebrow, ExternalButtonLink } from "@/components/common/ui";
import { siteConfig } from "@/config/site";

export function InstagramCta() {
  return (
    <section aria-labelledby="instagram-title" className="instagram-section">
      <Container>
        <div className="instagram-panel">
          <div>
            <Eyebrow>Keep learning, one idea at a time</Eyebrow>
            <h2 id="instagram-title">Learn something new every day.</h2>
            <p>Follow along for practical developer interview tips and bite-sized concepts.</p>
          </div>
          {siteConfig.social.instagramUrl ? (
            <ExternalButtonLink href={siteConfig.social.instagramUrl}>
              <Icon name="instagram" />
              Visit Instagram
            </ExternalButtonLink>
          ) : (
            <span className="social-not-configured">
              <Icon name="instagram" />
              Instagram profile link will be added soon.
            </span>
          )}
        </div>
      </Container>
    </section>
  );
}
