import type { LinkCard } from "../../types/home";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";

type ContentResourcesSectionProps = {
  eyebrow: string;
  title: string;
  caseCards: LinkCard[];
  onCaseClick?: (card: LinkCard) => void;
};

export function ContentResourcesSection({
  eyebrow,
  title,
  caseCards,
  onCaseClick
}: ContentResourcesSectionProps) {
  return (
    <section className="resource-section" aria-labelledby="content-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title" id="content-heading">
            {title}
          </h2>
        </div>
      </div>

      <div className="content-card-list">
        {caseCards.map((card) => (
          <InteractiveCardButton
            key={card.title}
            className="content-card content-card--interactive"
            onClick={() => onCaseClick?.(card)}
          >
            {card.eyebrow ? <p className="content-card__eyebrow">{card.eyebrow}</p> : null}
            <h4 className="content-card__title">{card.title}</h4>
            <p className="content-card__description">{card.description}</p>
          </InteractiveCardButton>
        ))}
      </div>
    </section>
  );
}
