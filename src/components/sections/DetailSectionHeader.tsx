export function DetailSectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="detail-section__header">
      <p className="detail-section__eyebrow">{eyebrow}</p>
      <h2 className="detail-section__title">{title}</h2>
    </div>
  );
}
