import type { ReactNode } from "react";

type BrandTitleProps = {
  className?: string;
};

export function BrandTitle({ className = "" }: BrandTitleProps): ReactNode {
  return (
    <span className={["site-brand-title", className].filter(Boolean).join(" ")} aria-label="B-SOFT">
      <span className="site-brand-title__b">B-</span>
      <span className="site-brand-title__soft">SOFT</span>
    </span>
  );
}
