type PopularHelpSectionProps = {
  items: string[];
  onItemClick?: (item: string) => void;
};

export function PopularHelpSection({ items, onItemClick }: PopularHelpSectionProps) {
  return (
    <section className="resource-section" aria-labelledby="popular-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="section-eyebrow">Popular help</p>
          <h2 className="section-title" id="popular-heading">
            Common questions right now
          </h2>
        </div>
      </div>

      <div className="popular-grid">
        {items.map((item) => (
          <button key={item} className="popular-link" type="button" onClick={() => onItemClick?.(item)}>
            <span>{item}</span>
            <span className="popular-link__arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
