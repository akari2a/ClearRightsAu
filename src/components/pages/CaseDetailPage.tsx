import { useEffect, useMemo, useState } from "react";
import type { CaseSectionMeta, SuccessCase } from "../../types/case";
import { DetailSectionHeader } from "../sections/DetailSectionHeader";
import { ActionCardSection } from "../sections/ActionCardSection";

type CaseDetailPageProps = {
  caseData: SuccessCase;
  sections: CaseSectionMeta[];
  relatedCases: SuccessCase[];
  onBackClick?: () => void;
  onRelatedGuideClick?: (route: string) => void;
  onRelatedCaseClick?: (caseData: SuccessCase) => void;
};

function riskToneClass(tone: string): string {
  if (tone === "low") return "risk-badge--low";
  if (tone === "caution") return "risk-badge--caution";
  if (tone === "danger") return "risk-badge--danger";
  return "risk-badge--warning";
}

function riskCardClass(tone: string): string {
  if (tone === "low") return "detail-page__risk-card detail-page__risk-card--low";
  if (tone === "caution") return "detail-page__risk-card detail-page__risk-card--caution";
  if (tone === "danger") return "detail-page__risk-card detail-page__risk-card--danger";
  return "detail-page__risk-card detail-page__risk-card--warning";
}

export function CaseDetailPage({
  caseData,
  sections,
  relatedCases,
  onBackClick,
  onRelatedGuideClick,
  onRelatedCaseClick
}: CaseDetailPageProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0].id);

  const sectionTitles = useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach((s) => {
      map[s.id] = s.title;
    });
    return map;
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean) as HTMLElement[];

      if (sectionElements.length === 0) return;

      const pageStart = sectionElements[0].offsetTop;
      const pageEnd = sectionElements[sectionElements.length - 1].offsetTop;
      const viewportAnchor = window.scrollY + window.innerHeight * 0.28;
      const totalDistance = Math.max(pageEnd - pageStart, 1);
      const rawProgress = ((window.scrollY - pageStart + window.innerHeight * 0.2) / totalDistance) * 100;

      setReadingProgress(Math.min(100, Math.max(0, rawProgress)));

      let currentSection = sectionElements[0];
      sectionElements.forEach((section) => {
        if (viewportAnchor >= section.offsetTop - 16) {
          currentSection = section;
        }
      });

      if (currentSection) {
        setActiveSectionId(currentSection.id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleSectionNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerOffset = 120;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="detail-page case-detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              {onBackClick ? (
                <button className="back-link" type="button" onClick={onBackClick}>
                  ← Back to cases
                </button>
              ) : null}
              <p className="detail-page__eyebrow">{caseData.categoryLabel} case</p>
              <h1 className="detail-page__title">{caseData.title}</h1>
              <p className="case-persona-tag">
                {caseData.persona.name}, {caseData.persona.age} — {caseData.persona.background}
              </p>

              <div className="case-glance">
                <div className="case-glance__item">
                  <p className="case-glance__label">Category</p>
                  <p className="case-glance__value">{caseData.categoryLabel}</p>
                </div>
                <div className="case-glance__item">
                  <p className="case-glance__label">Risk level</p>
                  <p className="case-glance__value">{caseData.riskLabel}</p>
                </div>
                <div className="case-glance__item">
                  <p className="case-glance__label">Outcome</p>
                  <p className="case-glance__value">{caseData.outcome.headline}</p>
                </div>
              </div>
            </div>

            <section className="detail-section" id="situation">
              <DetailSectionHeader eyebrow={`1. ${sections[0].eyebrow}`} title={sections[0].title} />
              <div className="case-narrative">
                {caseData.situation.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="case-narrative__paragraph">{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="detail-section" id="assessment">
              <DetailSectionHeader eyebrow={`2. ${sections[1].eyebrow}`} title={sections[1].title} />
              <div className={riskCardClass(caseData.riskTone)}>
                <p className={`risk-badge ${riskToneClass(caseData.riskTone)}`}>
                  {caseData.riskLabel}
                </p>
                <h2 className="detail-page__card-title">{caseData.riskHeadline}</h2>
                <p className="detail-page__card-text">{caseData.riskExplanation}</p>
              </div>
            </section>
          </div>

          <section className="detail-section" id="action-plan">
            <DetailSectionHeader eyebrow={`3. ${sections[2].eyebrow}`} title={sections[2].title} />
            <div className="detail-grid">
              {caseData.actionCards.map((card) => (
                <ActionCardSection key={card.id} card={card} />
              ))}
            </div>
          </section>

          <section className="detail-section" id="outcome">
            <DetailSectionHeader eyebrow={`4. ${sections[3].eyebrow}`} title={sections[3].title} />
            <div className="case-outcome-card">
              <h2 className="detail-page__card-title">{caseData.outcome.headline}</h2>
              <p className="detail-page__card-text">{caseData.outcome.description}</p>
            </div>
          </section>

          <section className="detail-section" id="takeaway">
            <DetailSectionHeader eyebrow={`5. ${sections[4].eyebrow}`} title={sections[4].title} />
            <ul className="detail-list">
              {caseData.takeaway.items.map((item) => (
                <li key={item} className="detail-list__item">{item}</li>
              ))}
            </ul>
            <button
              className="case-cta-callout"
              type="button"
              onClick={() => onRelatedGuideClick?.(caseData.takeaway.relatedGuideRoute)}
            >
              <span className="case-cta-callout__text">{caseData.takeaway.relatedGuideLabel}</span>
              <span className="case-cta-callout__arrow" aria-hidden="true">→</span>
            </button>
          </section>

          {relatedCases.length > 0 ? (
            <div className="case-related">
              <p className="case-related__title">Continue exploring cases</p>
              <div className="case-related__grid">
                {relatedCases.map((relCase) => (
                  <a
                    key={relCase.id}
                    href={`/cases/${relCase.id}`}
                    className="content-card content-card--interactive"
                    onClick={(e) => {
                      e.preventDefault();
                      onRelatedCaseClick?.(relCase);
                    }}
                  >
                    <p className="content-card__eyebrow">{relCase.categoryLabel}</p>
                    <p className="content-card__title">{relCase.title}</p>
                    <p className="case-card__meta">
                      {relCase.persona.name} · {relCase.riskLabel}
                    </p>
                    <p className="case-card__action">Read case →</p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          <nav className="detail-page-nav" aria-label="On this page">
            <div className="detail-progress" aria-hidden="true">
              <span className="detail-progress__bar" style={{ height: `${readingProgress}%` }} />
            </div>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`detail-page-nav__item${activeSectionId === section.id ? " detail-page-nav__item--active" : ""}`}
                type="button"
                onClick={() => handleSectionNavigate(section.id)}
              >
                <span className="detail-page-nav__number">{section.number}</span>
                <span className="detail-page-nav__label">{sectionTitles[section.id]}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}
