import { useEffect, useMemo, useState } from "react";
import type { CaseSectionMeta, SuccessCase } from "../../types/case";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";
import { CaseCategoryTag } from "../case/CaseCategoryTag";
import { RiskSummaryCard } from "../risk/RiskSummaryCard";
import { StepDetailCard } from "../steps/StepDetailCard";
import { DetailSectionHeader } from "../sections/DetailSectionHeader";

type CaseDetailPageProps = {
  caseData: SuccessCase;
  sections: CaseSectionMeta[];
  relatedCases: SuccessCase[];
  onRelatedGuideClick?: (route: string) => void;
  onRelatedCaseClick?: (caseData: SuccessCase) => void;
};

function riskToneClass(tone: string): string {
  if (tone === "low") return "risk-badge--low";
  if (tone === "caution") return "risk-badge--caution";
  if (tone === "danger") return "risk-badge--danger";
  return "risk-badge--warning";
}

function getCaseRiskLevelLabel(tone: string): string {
  if (tone === "low") return "Risk level 0";
  if (tone === "caution") return "Risk level 1";
  if (tone === "danger") return "Risk level 4";
  return "Risk level 2";
}

function getOutcomeSummaryLabel(headline: string): string {
  return headline.split("—")[0]?.trim() || headline;
}

function getAssessmentSectionTitle(category: SuccessCase["category"]) {
  return category === "scam" ? "How serious was this?" : "What this could mean";
}

function getAssessmentSectionEyebrow(category: SuccessCase["category"]) {
  return category === "scam" ? "RISK ASSESSMENT" : "WHAT THIS COULD MEAN";
}

export function CaseDetailPage({
  caseData,
  sections,
  relatedCases,
  onRelatedGuideClick,
  onRelatedCaseClick
}: CaseDetailPageProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0].id);
  const isScamCase = caseData.category === "scam";
  const riskLevelLabel = useMemo(() => getCaseRiskLevelLabel(caseData.riskTone), [caseData.riskTone]);
  const outcomeSummaryLabel = useMemo(() => getOutcomeSummaryLabel(caseData.outcome.headline), [caseData.outcome.headline]);
  const assessmentSectionTitle = useMemo(() => getAssessmentSectionTitle(caseData.category), [caseData.category]);
  const assessmentSectionEyebrow = useMemo(() => getAssessmentSectionEyebrow(caseData.category), [caseData.category]);
  const actionSteps = useMemo(
    () =>
      caseData.actionCards.map((card) => ({
        id: card.id,
        summary: card.title,
        text: card.items.map((item) => `• ${item}`).join("\n")
      })),
    [caseData.actionCards]
  );

  const sectionTitles = useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach((s) => {
      map[s.id] = s.title;
    });
    map.assessment = assessmentSectionTitle;
    return map;
  }, [assessmentSectionTitle, sections]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean) as HTMLElement[];

      if (sectionElements.length === 0) return;

      const viewportAnchor = window.scrollY + window.innerHeight * 0.28;

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
              <div className="detail-page__title-group">
                <CaseCategoryTag category={caseData.category} label={`${caseData.categoryLabel} case`} className="detail-page__eyebrow" />
                <h1 className="detail-page__title">{caseData.title}</h1>
              </div>
              <p className="case-persona-tag">
                {caseData.persona.name}, {caseData.persona.age} — {caseData.persona.background}
              </p>

              <div className="case-glance">
                <div className="case-glance__item">
                  <p className="case-glance__label">Category</p>
                  <p className="case-glance__value">{caseData.categoryLabel}</p>
                </div>
                {isScamCase ? (
                  <div className="case-glance__item">
                    <p className="case-glance__label">Risk level</p>
                    <p className="case-glance__value">{riskLevelLabel}</p>
                  </div>
                ) : null}
                <div className="case-glance__item">
                  <p className="case-glance__label">Outcome</p>
                  <p className="case-glance__value">{outcomeSummaryLabel}</p>
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
              {isScamCase ? (
                <button
                  className="case-cta-callout"
                  type="button"
                  onClick={() => onRelatedGuideClick?.(caseData.takeaway.relatedGuideRoute)}
                >
                  <span className="case-cta-callout__text">{caseData.takeaway.relatedGuideLabel}</span>
                  <span className="case-cta-callout__arrow" aria-hidden="true">→</span>
                </button>
              ) : null}
            </section>

          <section className="detail-section" id="assessment">
            <DetailSectionHeader eyebrow={`2. ${assessmentSectionEyebrow}`} title={assessmentSectionTitle} />
            {isScamCase ? (
              <RiskSummaryCard
                label={riskLevelLabel}
                tone={riskToneClass(caseData.riskTone).replace("risk-badge--", "") as "low" | "caution" | "warning" | "danger"}
                title={caseData.riskHeadline}
                summary={caseData.riskExplanation}
              />
            ) : (
              <div className="case-narrative">
                <p className="case-narrative__paragraph case-narrative__paragraph--emphasis">{caseData.riskHeadline}</p>
                <p className="case-narrative__paragraph">{caseData.riskExplanation}</p>
              </div>
            )}
          </section>
          </div>

          <section className="detail-section" id="action-plan">
            <DetailSectionHeader eyebrow={`3. ${sections[2].eyebrow}`} title={sections[2].title} />
            <div className="detail-step-list">
              {actionSteps.map((step, index) => (
                <StepDetailCard key={step.id} number={index + 1} summary={step.summary} text={step.text} />
              ))}
            </div>
          </section>

          <section className="detail-section" id="outcome">
            <DetailSectionHeader eyebrow={`4. ${sections[3].eyebrow}`} title={sections[3].title} />
            {isScamCase ? (
              <div className="case-outcome-card">
                <h2 className="detail-page__card-title">{caseData.outcome.headline}</h2>
                <p className="detail-page__card-text">{caseData.outcome.description}</p>
              </div>
            ) : (
              <div className="case-narrative">
                <p className="case-narrative__paragraph case-narrative__paragraph--emphasis">{caseData.outcome.headline}</p>
                <p className="case-narrative__paragraph">{caseData.outcome.description}</p>
              </div>
            )}
          </section>

          <section className="detail-section" id="takeaway">
            <DetailSectionHeader eyebrow={`5. ${sections[4].eyebrow}`} title={sections[4].title} />
            <ul className="detail-list">
              {caseData.takeaway.items.map((item) => (
                <li key={item} className="detail-list__item">{item}</li>
              ))}
            </ul>
            {!isScamCase ? (
              <button
                className="case-cta-callout"
                type="button"
                onClick={() => onRelatedGuideClick?.(caseData.takeaway.relatedGuideRoute)}
              >
                <span className="case-cta-callout__text">{caseData.takeaway.relatedGuideLabel}</span>
                <span className="case-cta-callout__arrow" aria-hidden="true">→</span>
              </button>
            ) : null}
          </section>

          {relatedCases.length > 0 ? (
            <div className="case-related">
              <p className="case-related__title">Continue exploring cases</p>
              <div className="case-related__grid">
                {relatedCases.map((relCase) => (
                  <InteractiveCardButton
                    key={relCase.id}
                    className="content-card content-card--interactive"
                    onClick={() => onRelatedCaseClick?.(relCase)}
                  >
                    <CaseCategoryTag category={relCase.category} label={relCase.categoryLabel} className="content-card__eyebrow" />
                    <p className="content-card__title">{relCase.title}</p>
                    <p className="content-card__description">{relCase.summary}</p>
                  </InteractiveCardButton>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          <nav className="detail-page-nav" aria-label="On this page">
            {sections.map((section) => (
              <InteractiveCardButton
                key={section.id}
                className={`detail-page-nav__item${activeSectionId === section.id ? " detail-page-nav__item--active" : ""}`}
                onClick={() => handleSectionNavigate(section.id)}
              >
                <span className="detail-page-nav__number">{section.number}</span>
                <span className="detail-page-nav__label">{sectionTitles[section.id]}</span>
              </InteractiveCardButton>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}
