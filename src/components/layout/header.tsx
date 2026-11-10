import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TechnologyIcon } from "@/components/common/icon";
import { Container } from "@/components/common/ui";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="site-header">
      <Container className="header-main">
        <Link aria-label="React Interview Hub home" className="brand" href="/">
          <span className="brand-mark">
            <TechnologyIcon name="react" />
          </span>
          <span>React Interview Hub</span>
        </Link>

        <nav aria-label="Main navigation" className="desktop-nav">
          {siteConfig.navigation.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
