import { ResultTextPair, shouldShowResultComparison } from "../i18n/ResultTextPair";

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
  comparisonSummary?: string;
  comparisonText?: string;
  comparisonEnabled?: boolean;
};

export function StepDetailCard({
  number,
  summary,
  text,
  comparisonSummary,
  comparisonText,
  comparisonEnabled = false
}: StepDetailCardProps) {
  const { summary: displaySummary, paragraphs } = deriveStepPresentation(summary, text);
  const comparisonPresentation =
    comparisonSummary || comparisonText
      ? deriveStepPresentation(comparisonSummary ?? summary, comparisonText ?? text)
      : null;

  return (
    <section className="detail-card detail-card--step">
      <span className="detail-card__floating-index" aria-hidden="true">
        {number}
      </span>
      <p className="detail-card__eyebrow">
        <ResultTextPair
          primary={displaySummary}
          secondary={comparisonPresentation?.summary}
          enabled={comparisonEnabled}
          secondaryClassName="detail-card__eyebrow-compare"
        />
      </p>
      {paragraphs.length > 0 ? (
        <div className="detail-card__step-body">
          {paragraphs.map((paragraph, index) => {
            const comparisonParagraph = comparisonPresentation?.paragraphs[index];

            return paragraph.startsWith("•") ? (
              <div key={`${number}-${index}`} className="detail-card__step-bullet">
                <span className="detail-card__step-bullet-dot" aria-hidden="true" />
                <div className="detail-card__step-bullet-copy">
                  <p className="detail-card__step-text detail-card__step-text--bullet">
                    {paragraph.replace(/^•\s*/, "")}
                  </p>
                  {shouldShowResultComparison(
                    paragraph.replace(/^•\s*/, ""),
                    comparisonParagraph?.replace(/^•\s*/, ""),
                    comparisonEnabled
                  ) ? (
                    <p className="detail-card__step-text detail-card__step-text--compare">
                      {comparisonParagraph?.replace(/^•\s*/, "")}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div key={`${number}-${index}`} className="detail-card__step-paragraph">
                <p className="detail-card__step-text">{paragraph}</p>
                {shouldShowResultComparison(paragraph, comparisonParagraph, comparisonEnabled) ? (
                  <p className="detail-card__step-text detail-card__step-text--compare">{comparisonParagraph}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
