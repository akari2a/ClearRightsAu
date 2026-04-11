import type { CaseIndexGroup, SuccessCase } from "../../types/case";
import { useRef } from "react";

type CaseShowcaseSectionProps = {
  group: CaseIndexGroup;
  cases: SuccessCase[];
  onCaseClick?: (caseData: SuccessCase) => void;
};

export function CaseShowcaseSection({ group, cases, onCaseClick }: CaseShowcaseSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = 320 + 24;
    trackRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const tint = group.tintColor ?? "#F0F7FF";
  const accent = group.accentColor ?? "#2563eb";

  return (
    <section className="showcase-section">
      <div className="showcase-header">
        <div className="showcase-header__text">
          <h2 className="showcase-header__title">{group.categoryLabel}</h2>
          <p className="showcase-header__description">{group.description}</p>
        </div>
        <div className="showcase-header__controls">
          <button
            type="button"
            className="showcase-arrow"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="showcase-arrow"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="showcase-track-wrapper">
        <div className="showcase-track" ref={trackRef}>
          {cases.map((caseItem) => (
            <a
              key={caseItem.id}
              href={`/cases/${caseItem.id}`}
              className="showcase-card"
              style={{ backgroundColor: tint }}
              onClick={(e) => {
                e.preventDefault();
                onCaseClick?.(caseItem);
              }}
            >
              {caseItem.cardImage ? (
                <img
                  className="showcase-card__bg"
                  src={caseItem.cardImage}
                  alt=""
                  loading="lazy"
                />
              ) : null}
              <div
                className="showcase-card__overlay"
                style={{
                  background: `linear-gradient(to bottom, ${tint}f2 0%, ${tint}f2 17%, ${tint}4d 50%, ${tint}f2 83%, ${tint}f2 100%)`
                }}
              />
              <div className="showcase-card__body">
                <div className="showcase-card__top">
                  <span className="showcase-card__eyebrow" style={{ color: accent }}>
                    {caseItem.categoryLabel}
                  </span>
                  <h3 className="showcase-card__title">{caseItem.title}</h3>
                </div>
                <div className="showcase-card__bottom">
                  <div className="showcase-card__info">
                    <span className="showcase-card__meta">
                      {caseItem.persona.name} · {caseItem.riskLabel}
                    </span>
                    <span className="showcase-card__read" style={{ "--accent": accent } as React.CSSProperties}>
                      Read
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
          <div className="showcase-track__spacer" />
        </div>
      </div>
    </section>
  );
}
