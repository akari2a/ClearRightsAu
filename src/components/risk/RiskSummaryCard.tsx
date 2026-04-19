import type { ReactNode } from "react";

type RiskSummaryTone = "low" | "caution" | "warning" | "high" | "danger" | "accent";

type RiskSummaryCardProps = {
  label?: ReactNode;
  tone: RiskSummaryTone;
  title: ReactNode;
  summary: ReactNode;
  children?: ReactNode;
};

export function RiskSummaryCard({ label, tone, title, summary, children }: RiskSummaryCardProps) {
  return (
    <div className={`detail-page__risk-card detail-result-intro detail-result-intro--${tone}`}>
      {label ? <span className={`risk-badge risk-badge--${tone}`}>{label}</span> : null}
      <h2 className="detail-result-intro__title">{title}</h2>
      <p className="detail-result-intro__summary">{summary}</p>
      {children}
    </div>
  );
}
