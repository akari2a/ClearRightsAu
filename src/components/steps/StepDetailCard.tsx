function stripSummaryPunctuation(value: string) {
  return value.replace(/[.。!?！？]+$/u, "").trim();
}

function deriveStepPresentation(summary: string, text: string) {
  const paragraphs = text
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const firstParagraph = paragraphs[0] ?? "";
  const normalizedSummary = stripSummaryPunctuation(summary);
  const normalizedFirstParagraph = stripSummaryPunctuation(firstParagraph);
  const firstParagraphLooksLikeSummary =
    paragraphs.length > 1 &&
    firstParagraph.length > 0 &&
    !firstParagraph.startsWith("•") &&
    !firstParagraph.endsWith(":") &&
    (normalizedFirstParagraph === normalizedSummary || firstParagraph.length <= 110);

  return {
    summary: firstParagraphLooksLikeSummary ? normalizedFirstParagraph : normalizedSummary,
    paragraphs: firstParagraphLooksLikeSummary ? paragraphs.slice(1) : paragraphs
  };
}

export function createStepPresentation(summary: string, text: string) {
  return deriveStepPresentation(summary, text);
}

type StepDetailCardProps = {
  number: number | string;
  summary: string;
  text: string;
};

export function StepDetailCard({ number, summary, text }: StepDetailCardProps) {
  const { summary: displaySummary, paragraphs } = deriveStepPresentation(summary, text);

  return (
    <section className="detail-card detail-card--step">
      <span className="detail-card__floating-index" aria-hidden="true">
        {number}
      </span>
      <p className="detail-card__eyebrow">{displaySummary}</p>
      {paragraphs.length > 0 ? (
        <div className="detail-card__step-body">
          {paragraphs.map((paragraph, index) =>
            paragraph.startsWith("•") ? (
              <div key={`${number}-${index}`} className="detail-card__step-bullet">
                <span className="detail-card__step-bullet-dot" aria-hidden="true" />
                <p className="detail-card__step-text detail-card__step-text--bullet">
                  {paragraph.replace(/^•\s*/, "")}
                </p>
              </div>
            ) : (
              <p key={`${number}-${index}`} className="detail-card__step-text">
                {paragraph}
              </p>
            )
          )}
        </div>
      ) : null}
    </section>
  );
}
