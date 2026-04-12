type ActionCard = {
  number: string;
  eyebrow: string;
  title: string;
  items: string[];
  ordered?: boolean;
};

export function ActionCardSection({ card }: { card: ActionCard }) {
  return (
    <section className="detail-card detail-card--step">
      <span className="detail-card__floating-index" aria-hidden="true">
        {card.number}
      </span>
      <p className="detail-card__eyebrow">{card.title}</p>
      <div className="detail-card__step-body">
        {card.ordered ? (
          <ol className="detail-card__step-order">
            {card.items.map((item) => (
              <li key={item} className="detail-card__step-order-item">
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="detail-card__step-list">
            {card.items.map((item) => (
              <li key={item} className="detail-card__step-list-item">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
