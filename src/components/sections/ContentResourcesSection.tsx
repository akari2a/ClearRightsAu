import type { LinkCard } from "../../types/home";

type ContentResourcesSectionProps = {
  eyebrow: string;
  title: string;
  caseGroupTitle: string;
  caseGroupDescription: string;
  guideGroupTitle: string;
  guideGroupDescription: string;
  caseCards: LinkCard[];
  guideCards: LinkCard[];
  onCaseClick?: (card: LinkCard) => void;
  onGuideClick?: (card: LinkCard) => void;
};

export function ContentResourcesSection({
  eyebrow,
  title,
  caseGroupTitle,
  caseGroupDescription,
  guideGroupTitle,
  guideGroupDescription,
  caseCards,
  guideCards,
  onCaseClick,
  onGuideClick
}: ContentResourcesSectionProps) {
  return (
    <section className="resource-section resource-section--split" aria-labelledby="content-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title" id="content-heading">
            {title}
          </h2>
        </div>
      </div>

      <div className="content-columns">
        <div className="content-group">
          <div className="content-group__header">
            <h3 className="content-group__title">{caseGroupTitle}</h3>
            <p className="content-group__description">{caseGroupDescription}</p>
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
            <h3 className="content-group__title">{guideGroupTitle}</h3>
            <p className="content-group__description">{guideGroupDescription}</p>
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
