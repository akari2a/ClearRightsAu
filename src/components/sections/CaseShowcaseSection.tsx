import type { CaseIndexGroup, SuccessCase } from "../../types/case";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";

type CaseShowcaseSectionProps = {
  group: CaseIndexGroup;
  cases: SuccessCase[];
  onCaseClick?: (caseData: SuccessCase) => void;
};

export function CaseShowcaseSection({ group, cases, onCaseClick }: CaseShowcaseSectionProps) {
  const accent = group.accentColor ?? "#2563eb";

  return (
    <section className="showcase-section" id={group.categoryKey}>
      <div className="showcase-header">
        <div className="showcase-header__text">
          <h2 className="showcase-header__title">{group.categoryLabel}</h2>
          <p className="showcase-header__description">{group.description}</p>
        </div>
      </div>

      <div className="showcase-grid">
        {cases.map((caseItem) => (
          <InteractiveCardButton
            key={caseItem.id}
            className="showcase-card"
            onClick={() => onCaseClick?.(caseItem)}
          >
            {caseItem.cardImage ? (
              <div className="showcase-card__media">
                <img
                  className="showcase-card__bg"
                  src={caseItem.cardImage}
                  alt=""
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="showcase-card__body">
              <div className="showcase-card__top">
                <span className="showcase-card__eyebrow" style={{ color: accent }}>
                  {caseItem.categoryLabel}
                </span>
                <h3 className="showcase-card__title">{caseItem.title}</h3>
                <p className="showcase-card__summary">{caseItem.summary}</p>
              </div>
              <div className="showcase-card__bottom">
                <span className="showcase-card__meta">
                  {caseItem.persona.name} · {caseItem.riskLabel}
                </span>
                <span className="showcase-card__read" style={{ "--accent": accent } as React.CSSProperties}>
                  Read case
                </span>
              </div>
            </div>
          </InteractiveCardButton>
        ))}
      </div>
    </section>
  );
}
