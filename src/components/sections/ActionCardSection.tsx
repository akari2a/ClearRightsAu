type ActionCard = {
  number: string;
  eyebrow: string;
  title: string;
  items: string[];
  ordered?: boolean;
};

export function ActionCardSection({ card }: { card: ActionCard }) {
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
