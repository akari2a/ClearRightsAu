type RiskSummaryTone = "low" | "caution" | "warning" | "high" | "danger";

type RiskSummaryCardProps = {
  label: string;
  tone: RiskSummaryTone;
  title: string;
  summary: string;
};

export function RiskSummaryCard({ label, tone, title, summary }: RiskSummaryCardProps) {
  return (
    <div className={`detail-page__risk-card detail-result-intro detail-result-intro--${tone}`}>
      <span className={`risk-badge risk-badge--${tone}`}>{label}</span>
      <h2 className="detail-result-intro__title">{title}</h2>
      <p className="detail-result-intro__summary">{summary}</p>
    </div>
  );
}
