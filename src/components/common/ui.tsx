import type { ReactNode } from "react";
import { Icon } from "@/components/common/icon";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" className="eyebrow-mark" />
      {children}
    </p>
  );
}

type BadgeProps = {
  children: ReactNode;
  variant?: "available" | "upcoming";
};

export function Badge({ children, variant }: BadgeProps) {
  const variantClass = variant ? ` badge-${variant}` : "";
  return <span className={`badge${variantClass}`}>{children}</span>;
}

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  download?: boolean;
};

export function ButtonLink({ children, href, variant = "primary", download = false }: ButtonLinkProps) {
  return (
    <a className={`button button-${variant}`} download={download || undefined} href={href}>
      {children}
    </a>
  );
}

export function ExternalButtonLink({ children, href }: Omit<ButtonLinkProps, "variant">) {
  return (
    <a
      className="button"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <Icon name="arrow-up-right" />
    </a>
  );
}
