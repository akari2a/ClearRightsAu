import { useEffect, useMemo, useState } from "react";
import { SCAM_DETAIL_SECTIONS, SCAM_JOURNEYS, getScamActionCards, getScamSectionTitle } from "../../content/scamCheckContent";
import type { DetailSectionMeta, ScamActionCard, ScamJourney, ScamJourneyKey } from "../../types/scam";

type ScamCheckPageProps = {
  onJourneyChange?: (journey: ScamJourney) => void;
  onSectionNavigate?: (section: DetailSectionMeta) => void;
  onCaseClick?: (title: string, journey: ScamJourney) => void;
};

function DetailSectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="detail-section__header">
      <p className="detail-section__eyebrow">{eyebrow}</p>
      <h2 className="detail-section__title">{title}</h2>
    </div>
  );
}

function ScamActionCardSection({ card }: { card: ScamActionCard }) {
  return (
    <section className="detail-card detail-card--numbered">
      <span className="detail-card__floating-index" aria-hidden="true">
        {card.number}
      </span>
      <p className="detail-card__eyebrow">{card.eyebrow}</p>
      <h2 className="detail-card__title">{card.title}</h2>
      {card.ordered ? (
        <ol className="detail-steps">
          {card.items.map((item) => (
            <li key={item} className="detail-steps__item">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="detail-list">
          {card.items.map((item) => (
            <li key={item} className="detail-list__item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ScamCheckPage({ onJourneyChange, onSectionNavigate, onCaseClick }: ScamCheckPageProps) {
  const [journeyKey, setJourneyKey] = useState<ScamJourneyKey>("unsure");
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>(SCAM_DETAIL_SECTIONS[0].id);
  const selectedJourney = useMemo(
    () => SCAM_JOURNEYS.find((journey) => journey.key === journeyKey) ?? SCAM_JOURNEYS[0],
    [journeyKey]
  );
  const firstJudgementTitle = getScamSectionTitle("first-judgement", selectedJourney.key);
  const actionCards = useMemo(() => getScamActionCards(selectedJourney), [selectedJourney]);

  useEffect(() => {
    onJourneyChange?.(selectedJourney);
  }, [onJourneyChange, selectedJourney]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SCAM_DETAIL_SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
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
  }, [selectedJourney.key]);

  const handleSectionNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    const sectionMeta = SCAM_DETAIL_SECTIONS.find((item) => item.id === sectionId);

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
              <h1 className="detail-page__title">Check if this is a scam</h1>
              <p className="detail-page__summary">{selectedJourney.summary}</p>
            </div>

            <section className="detail-section" id="choose-path">
              <DetailSectionHeader eyebrow={`1. ${SCAM_DETAIL_SECTIONS[0].eyebrow}`} title={SCAM_DETAIL_SECTIONS[0].title} />

              <div className="journey-switcher">
              <div className="journey-switcher__grid">
                {SCAM_JOURNEYS.map((journey) => {
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
              <DetailSectionHeader eyebrow={`2. ${SCAM_DETAIL_SECTIONS[1].eyebrow}`} title={firstJudgementTitle} />

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
            <DetailSectionHeader eyebrow={`3. ${SCAM_DETAIL_SECTIONS[2].eyebrow}`} title={SCAM_DETAIL_SECTIONS[2].title} />

            <div className="detail-grid">
              {actionCards.map((card) => (
                <ScamActionCardSection key={card.id} card={card} />
              ))}
            </div>
          </section>

          <section className="detail-section detail-cases" id="real-situations">
            <DetailSectionHeader eyebrow={`4. ${SCAM_DETAIL_SECTIONS[3].eyebrow}`} title={SCAM_DETAIL_SECTIONS[3].title} />

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
                  <p className="detail-case-card__eyebrow">Case</p>
                  <p className="detail-case-card__title">{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          <nav className="detail-page-nav" aria-label="On this page">
            {SCAM_DETAIL_SECTIONS.map((section) => {
              const title = getScamSectionTitle(section.id, selectedJourney.key);

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
