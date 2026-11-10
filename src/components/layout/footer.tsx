import Link from "next/link";
import { Icon } from "@/components/common/icon";
import { Container } from "@/components/common/ui";
import { siteConfig } from "@/config/site";
import { getAllTechnologies } from "@/lib/content";

function SocialLink({ href, label, icon }: { href?: string; label: string; icon: "instagram" | "github" }) {
  if (!href) {
    return <span className="not-configured">{label} · not configured</span>;
  }

  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      <Icon name={icon} />
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link aria-label="React Interview Hub home" className="brand" href="/">
              <span className="brand-mark">
                <Icon name="code" />
              </span>
              <span>{siteConfig.name}</span>
            </Link>
            <p className="footer-description">
              Clear, practical preparation for the conversations that move your
              developer career forward.
            </p>
          </div>

          <div className="footer-column">
            <h2>Explore</h2>
            <div className="footer-links">
              {siteConfig.navigation.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h2>Technologies</h2>
            <div className="footer-links">
              {getAllTechnologies().map((technology) => (
                technology.status === "available" ? (
                  <Link href="/react" key={technology.id}>
                    {technology.name}
                  </Link>
                ) : (
                  <span key={technology.name}>{technology.name} · soon</span>
                )
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h2>Connect</h2>
            <div className="footer-links">
              <SocialLink href={siteConfig.social.instagramUrl} icon="instagram" label="Instagram" />
              <SocialLink href={siteConfig.social.githubUrl} icon="github" label="GitHub" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Made for curious developers.</p>
        </div>
      </Container>
    </footer>
  );
}
