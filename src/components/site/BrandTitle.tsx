type BrandTitleProps = {
  className?: string;
};

export function BrandTitle({ className = "" }: BrandTitleProps) {
  return (
    <span className={["site-brand-title", className].filter(Boolean).join(" ")} aria-label="Business CRM">
      <span className="site-brand-title__line site-brand-title__business">Business</span>
      <span className="site-brand-title__line site-brand-title__crm">CRM</span>
    </span>
  );
}
