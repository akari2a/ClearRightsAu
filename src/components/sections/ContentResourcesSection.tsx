import type { LinkCard } from "../../types/home";

type ContentResourcesSectionProps = {
  caseCards: LinkCard[];
  guideCards: LinkCard[];
  onCaseClick?: (card: LinkCard) => void;
  onGuideClick?: (card: LinkCard) => void;
};

export function ContentResourcesSection({
  caseCards,
  guideCards,
  onCaseClick,
  onGuideClick
}: ContentResourcesSectionProps) {
  return (
    <section className="resource-section resource-section--split" aria-labelledby="content-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="section-eyebrow">Explore</p>
          <h2 className="section-title" id="content-heading">
            Cases and step-by-step guides
          </h2>
        </div>
      </div>

      <div className="content-columns">
        <div className="content-group">
          <div className="content-group__header">
            <h3 className="content-group__title">Success cases</h3>
            <p className="content-group__description">
              Examples that help users recognise familiar situations before they act.
            </p>
          </div>
          <div className="content-card-list">
            {caseCards.map((card) => (
              <button key={card.title} className="content-card content-card--interactive" type="button" onClick={() => onCaseClick?.(card)}>
                {card.eyebrow ? <p className="content-card__eyebrow">{card.eyebrow}</p> : null}
                <h4 className="content-card__title">{card.title}</h4>
                <p className="content-card__description">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="content-group">
          <div className="content-group__header">
            <h3 className="content-group__title">Next-step guides</h3>
            <p className="content-group__description">
              Structured guidance for what to do first, what evidence to keep, and when to escalate.
            </p>
          </div>
          <div className="content-card-list">
            {guideCards.map((card) => (
              <button key={card.title} className="content-card content-card--interactive" type="button" onClick={() => onGuideClick?.(card)}>
                {card.eyebrow ? <p className="content-card__eyebrow">{card.eyebrow}</p> : null}
                <h4 className="content-card__title">{card.title}</h4>
                <p className="content-card__description">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
