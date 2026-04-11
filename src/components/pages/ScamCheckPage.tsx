import { useEffect, useMemo, useState } from "react";
import { getScamActionCards, getScamPageContent, getScamSectionTitle } from "../../content/scamCheckContent";
import { DEFAULT_LOCALE } from "../../i18n/config";
import type { DetailSectionMeta, ScamJourney, ScamJourneyKey } from "../../types/scam";
import { DetailSectionHeader } from "../sections/DetailSectionHeader";
import { ActionCardSection } from "../sections/ActionCardSection";

type ScamCheckPageProps = {
  onJourneyChange?: (journey: ScamJourney) => void;
  onSectionNavigate?: (section: DetailSectionMeta) => void;
  onCaseClick?: (title: string, journey: ScamJourney) => void;
};

export function ScamCheckPage({ onJourneyChange, onSectionNavigate, onCaseClick }: ScamCheckPageProps) {
  const pageContent = useMemo(() => getScamPageContent(DEFAULT_LOCALE), []);
  const sections = pageContent.sections;
  const journeys = pageContent.journeys;
  const [journeyKey, setJourneyKey] = useState<ScamJourneyKey>("unsure");
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0].id);
  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.key === journeyKey) ?? journeys[0],
    [journeyKey, journeys]
  );
  const firstJudgementTitle = getScamSectionTitle(sections, "first-judgement", selectedJourney.key);
  const actionCards = useMemo(() => getScamActionCards(pageContent, selectedJourney), [pageContent, selectedJourney]);

  useEffect(() => {
    onJourneyChange?.(selectedJourney);
  }, [onJourneyChange, selectedJourney]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
      const pageStart = sectionElements[0]?.offsetTop ?? 0;
      const pageEnd = sectionElements[sectionElements.length - 1]?.offsetTop ?? pageStart;
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
  }, [sections, selectedJourney.key]);

  const handleSectionNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    const sectionMeta = sections.find((item) => item.id === sectionId);

    if (!section) {
      return;
    }

    if (sectionMeta) {
      onSectionNavigate?.(sectionMeta);
    }

    const headerOffset = 120;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              <h1 className="detail-page__title">{pageContent.pageTitle}</h1>
              <p className="detail-page__summary">{selectedJourney.summary}</p>
            </div>

            <section className="detail-section" id="choose-path">
              <DetailSectionHeader eyebrow={`1. ${sections[0].eyebrow}`} title={sections[0].title} />

              <div className="journey-switcher">
              <div className="journey-switcher__grid">
                {journeys.map((journey) => {
                  const isActive = journey.key === selectedJourney.key;

                  return (
                    <button
                      key={journey.key}
                      className={`journey-option${isActive ? " journey-option--active" : ""}`}
                      type="button"
                      onClick={() => setJourneyKey(journey.key)}
                    >
                      <span className="journey-option__title">{journey.optionLabel}</span>
                      <span className="journey-option__description">{journey.optionDescription}</span>
                    </button>
                  );
                })}
              </div>
              </div>
            </section>

            <section className="detail-section" id="first-judgement">
              <DetailSectionHeader eyebrow={`2. ${sections[1].eyebrow}`} title={firstJudgementTitle} />

              <div className="detail-page__risk-card">
                {selectedJourney.riskLabel ? (
                  <p className={`risk-badge ${selectedJourney.riskTone === "danger" ? "risk-badge--danger" : "risk-badge--warning"}`}>
                    {selectedJourney.riskLabel}
                  </p>
                ) : null}
                <h2 className="detail-page__card-title">{selectedJourney.headline}</h2>
                <p className="detail-page__card-text">{selectedJourney.cardText}</p>
              </div>
            </section>
          </div>

          <section className="detail-section" id="action-plan">
            <DetailSectionHeader eyebrow={`3. ${sections[2].eyebrow}`} title={sections[2].title} />

            <div className="detail-grid">
              {actionCards.map((card) => (
                <ActionCardSection key={card.id} card={card} />
              ))}
            </div>
          </section>

          <section className="detail-section detail-cases" id="real-situations">
            <DetailSectionHeader eyebrow={`4. ${sections[3].eyebrow}`} title={sections[3].title} />

            <div className="detail-cases__grid">
              {selectedJourney.cases.map((item) => (
                <article
                  key={item}
                  className="detail-case-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onCaseClick?.(item, selectedJourney)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onCaseClick?.(item, selectedJourney);
                    }
                  }}
                >
                  <p className="detail-case-card__eyebrow">{pageContent.caseEyebrow}</p>
                  <p className="detail-case-card__title">{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          <nav className="detail-page-nav" aria-label="On this page">
            {sections.map((section) => {
              const title = getScamSectionTitle(sections, section.id, selectedJourney.key);

              return (
                <button
                  key={section.id}
                  className={`detail-page-nav__item${activeSectionId === section.id ? " detail-page-nav__item--active" : ""}`}
                  type="button"
                  onClick={() => handleSectionNavigate(section.id)}
                >
                  <span className="detail-page-nav__number">{section.number}</span>
                  <span className="detail-page-nav__label">{title}</span>
                </button>
              );
            })}
          </nav>

          <div className="detail-progress-group">
            <div className="detail-progress" aria-hidden="true">
              <span className="detail-progress__bar" style={{ height: `${readingProgress}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
