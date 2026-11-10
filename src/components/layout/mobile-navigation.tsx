"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/common/icon";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        aria-controls="mobile-site-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="icon-button mobile-nav-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
        type="button"
      >
        <Icon name={isOpen ? "close" : "menu"} />
      </button>
      <nav
        aria-label="Mobile navigation"
        className="mobile-nav"
        hidden={!isOpen}
        id="mobile-site-navigation"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            toggleRef.current?.focus();
          }
        }}
      >
        <div className="container mobile-nav-links">
          {siteConfig.navigation.map((link) => (
            <Link
              className="nav-link"
              href={link.href}
              key={link.label}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
