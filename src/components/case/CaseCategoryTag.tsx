import type { CaseCategoryKey } from "../../types/case";

type CaseCategoryTagProps = {
  category: CaseCategoryKey | "refund";
  label: string;
  className?: string;
};

const CASE_CATEGORY_TONE_MAP: Record<CaseCategoryTagProps["category"], string> = {
  scam: "scam",
  refund: "refund",
  "product-safety": "refund",
  tenancy: "tenancy"
};

export function CaseCategoryTag({ category, label, className = "" }: CaseCategoryTagProps) {
  const tone = CASE_CATEGORY_TONE_MAP[category];
  const resolvedClassName = [
    "case-category-tag",
    tone ? `case-category-tag--${tone}` : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={resolvedClassName}>{label}</span>;
}
