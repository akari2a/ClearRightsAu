import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCasesPageContent } from "../../../content/casesContent";
import { DEFAULT_LOCALE, type AppLocale } from "../../../i18n/config";
import { getUiCopy } from "../../../i18n/copy";
import type { QuickCheckAnswers } from "../../../types/quickCheck";
import type { GuideResult, GuideResultSection, GuideScenarioConfig } from "../../../types/guide";
import { InteractiveCardButton } from "../../controls/InteractiveCardButton";
import { CaseCategoryTag } from "../../case/CaseCategoryTag";
import { RiskSummaryCard } from "../../risk/RiskSummaryCard";
import { createStepPresentation, StepDetailCard } from "../../steps/StepDetailCard";
import { QuickCheckExitDialog } from "../scam-check/QuickCheckExitDialog";
import {
  isOptionSelected,
  parseQuestionnaireUrlState,
  useGuideQuestionnaire
} from "../../../hooks/useGuideQuestionnaire";

type GuideCheckPageShellProps = {
  locale?: AppLocale;
  config: GuideScenarioConfig;
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, result: GuideResult | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

function getRiskLevelPresentation(riskLevel: number) {
  if (riskLevel === 0) return { label: "Risk level 0", tone: "low" as const };
  if (riskLevel === 1) return { label: "Risk level 1", tone: "caution" as const };
  if (riskLevel === 2) return { label: "Risk level 2", tone: "warning" as const };
  if (riskLevel === 3) return { label: "Risk level 3", tone: "high" as const };
  if (riskLevel === 4) return { label: "Risk level 4", tone: "danger" as const };
  return { label: "Risk level", tone: "warning" as const };
}

type FlattenedStep = {
  id: string;
  number: number;
  summary: string;
  text: string;
  navLabel: string;
  sectionTitle: string | null;
};

function flattenAllSections(
  sections: readonly GuideResultSection[],
  answers: QuickCheckAnswers,
  config: GuideScenarioConfig,
  locale: string
): FlattenedStep[] {
  const steps: FlattenedStep[] = [];
  let globalNumber = 0;

  for (const section of sections) {
    let isFirstStepInSection = true;

    for (const step of section.steps) {
      if (!config.shouldDisplayActionItem(step, answers)) {
        continue;
      }

      globalNumber += 1;
      const resolvedSummary = config.resolveActionItemSummary(step, locale as never);
      const resolvedText = config.resolveActionItemText(step, answers, locale as never);
      const presentation = createStepPresentation(resolvedSummary, resolvedText);

      steps.push({
        id: `result-step-${step.id}`,
        number: globalNumber,
        summary: presentation.summary,
        text: presentation.paragraphs.join("\n"),
        navLabel: presentation.summary,
        sectionTitle: isFirstStepInSection ? section.title : null
      });

      isFirstStepInSection = false;
    }
  }

  return steps;
}

function getLocalizedText(text: Record<string, string>, locale: string = DEFAULT_LOCALE): string {
  return text[locale] ?? text[DEFAULT_LOCALE] ?? Object.values(text)[0] ?? "";
}

export function GuideCheckPageShell({
  locale = DEFAULT_LOCALE,
  config,
  onQuestionnaireComplete,
  onSectionNavigate
}: GuideCheckPageShellProps) {
  const navigate = useNavigate();
  const uiCopy = getUiCopy(locale);
  const questions = useMemo(() => [...config.questions], [config.questions]);
  const initialQuestionnaireUrlState = useMemo(
    () => parseQuestionnaireUrlState(window.location.search, questions),
    [questions]
  );
  const casesContent = useMemo(() => getCasesPageContent(locale), [locale]);
  const [isComplete, setIsComplete] = useState(initialQuestionnaireUrlState.resultView);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialQuestionnaireUrlState.resultView ? "action-plan" : "questionnaire"
  );

  const {
    answers,
    currentQuestion,
    currentQuestionIndex,
    currentSelectionCount,
    isExitDialogOpen,
    isMultiSelectQuestion,
    questionnaireProgress,
    handleOptionSelect,
    handleContinue,
    handleGoBack,
    handleRestart,
    handleStayInQuestionnaire,
    handleLeaveQuestionnaire
  } = useGuideQuestionnaire({
    questions,
    basePath: config.basePath,
    isComplete,
    onComplete: () => setIsComplete(true),
    onShowResults: () => handleSectionNavigate("action-plan"),
    onRestoreResult: () => {
      setIsComplete(true);
      setActiveSectionId("action-plan");
    }
  });

  const currentAnswer = answers[currentQuestion.id];

  const resolvedResult = useMemo<GuideResult | null>(
    () => (isComplete ? config.resolveResult(answers) : null),
    [answers, isComplete, config]
  );

  const resultSections = useMemo<readonly GuideResultSection[]>(
    () => (resolvedResult ? config.getResultSections(resolvedResult, answers) : []),
    [resolvedResult, answers, config]
  );

  const resultBadge = useMemo(
    () => getRiskLevelPresentation(resolvedResult?.riskLevel ?? 2),
    [resolvedResult]
  );

  const flattenedSteps = useMemo(
    () => (resultSections.length > 0 ? flattenAllSections(resultSections, answers, config, locale) : []),
    [resultSections, answers, config, locale]
  );

  const resultNavItems = useMemo(
    () => flattenedSteps.map((step) => ({ id: step.id, title: step.navLabel })),
    [flattenedSteps]
  );

  const relatedCases = useMemo(
    () => casesContent.cases.filter(config.relatedCasesFilter).slice(0, 3),
    [casesContent, config]
  );

  const mergedPrepare = useMemo(() => {
    const items: Array<{ id: string; text: string }> = [];
    const seenIds = new Set<string>();

    for (const section of resultSections) {
      for (const item of section.prepare ?? []) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          const text = config.resolveActionItemText(item, answers, locale as never);
          if (text.length > 0) {
            items.push({ id: item.id, text });
          }
        }
      }
    }

    return items;
  }, [resultSections, answers, locale, config]);

  const mergedHelp = useMemo(() => {
    const items: Array<{ id: string; text: string }> = [];
    const seenTexts = new Set<string>();

    for (const section of resultSections) {
      for (const item of section.help ?? []) {
        const text = config.resolveActionItemText(item, answers, locale as never);
        if (text.length > 0 && !seenTexts.has(text)) {
          seenTexts.add(text);
          items.push({ id: item.id, text });
        }
      }
    }

    return items;
  }, [resultSections, answers, locale, config]);

  useEffect(() => {
    if (isComplete && resolvedResult) {
      onQuestionnaireComplete?.(answers, resolvedResult);
    }
  }, [answers, isComplete, onQuestionnaireComplete, resolvedResult]);

  useEffect(() => {
    if (!isComplete) {
      setActiveSectionId("questionnaire");
      return;
    }
    setActiveSectionId(resultNavItems[0]?.id ?? "action-plan");
  }, [isComplete, resultNavItems]);

  useEffect(() => {
    if (!isComplete || resultNavItems.length === 0) {
      return;
    }

    const handleScroll = () => {
      const sectionElements = resultNavItems
        .map((s) => document.getElementById(s.id))
        .filter(Boolean) as HTMLElement[];

      const viewportAnchor = window.scrollY + window.innerHeight * 0.28;
      let current = sectionElements[0];

      sectionElements.forEach((el) => {
        if (viewportAnchor >= el.offsetTop - 16) {
          current = el;
        }
      });

      if (current) {
        setActiveSectionId(current.id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isComplete, resultNavItems]);

  const handleSectionNavigate = (sectionId: string) => {
    if (sectionId === "action-plan" && !isComplete) {
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    onSectionNavigate?.(sectionId);
    const headerOffset = 120;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const restartQuestionnaire = () => {
    handleRestart();
    setIsComplete(false);
    setActiveSectionId("questionnaire");
  };

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              <h1 className="detail-page__title">{isComplete ? uiCopy.guide.whatToDoNext : uiCopy.guide.checkYourSituation}</h1>
              {!isComplete && <p className="detail-page__summary">{config.scenarioId === "unsafe-products" ? uiCopy.guide.unsafeIntro : config.scenarioId === "refund" ? uiCopy.guide.refundIntro : uiCopy.guide.scamIntro}</p>}
            </div>
          </div>

          {!isComplete ? (
            <section className="detail-section" id="questionnaire">
              <div className="questionnaire-progress-block" aria-label={uiCopy.guide.questionnaireProgress}>
                <div className="questionnaire-progress-block__copy">
                  <p className="questionnaire-progress-block__label">{uiCopy.guide.questionnaireProgress}</p>
                  <p className="questionnaire-progress-block__step">
                    {uiCopy.guide.stepOf(Math.min(currentQuestionIndex + 1, questions.length), questions.length)}
                  </p>
                </div>
                <div className="questionnaire-progress-block__track" aria-hidden="true">
                  <span className="questionnaire-progress-block__fill" style={{ width: `${questionnaireProgress}%` }} />
                </div>
              </div>

              <div className="questionnaire-panel">
                <div className="questionnaire-panel__meta">
                  <div className="questionnaire-panel__toolbar">
                    <button
                      className="back-link"
                      type="button"
                      onClick={handleGoBack}
                      style={{ visibility: currentQuestionIndex > 0 ? "visible" : "hidden" }}
                      aria-hidden={currentQuestionIndex === 0 ? "true" : undefined}
                      tabIndex={currentQuestionIndex === 0 ? -1 : 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                      </svg>
                      {uiCopy.guide.previousStep}
                    </button>
                    {isMultiSelectQuestion ? (
                      <button
                        className="questionnaire-continue"
                        type="button"
                        onClick={handleContinue}
                        disabled={currentSelectionCount === 0}
                      >
                        {uiCopy.guide.continue}
                      </button>
                    ) : null}
                  </div>
                  <h3 className="questionnaire-panel__title">{getLocalizedText(currentQuestion.title, locale)}</h3>
                  {getLocalizedText(currentQuestion.description, locale) ? (
                    <p className="questionnaire-panel__description">{getLocalizedText(currentQuestion.description, locale)}</p>
                  ) : null}
                </div>

                <div className="questionnaire-options">
                  {currentQuestion.options.map((option) => {
                    const isSelected = isOptionSelected(currentAnswer, option.id);
                    return (
                      <InteractiveCardButton
                        key={option.id}
                        className={`questionnaire-option${isSelected ? " questionnaire-option--active" : ""}`}
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        <span className="questionnaire-option__title">{getLocalizedText(option.label, locale)}</span>
                      </InteractiveCardButton>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : (
            <section className="detail-section" id="action-plan">
              <RiskSummaryCard
                label={
                  resolvedResult?.riskLevel !== undefined
                    ? `${uiCopy.guide.riskLevelPrefix} ${resolvedResult.riskLevel}`
                    : resultBadge.label
                }
                tone={resultBadge.tone}
                title={resolvedResult?.primaryLabel ?? uiCopy.guide.resultFallback}
                summary={resolvedResult?.primarySummary ?? ""}
              />

              <div className="detail-step-list">
                {flattenedSteps.map((step) => (
                  <section key={step.id} id={step.id}>
                    {step.sectionTitle ? (
                      <div className="guide-result-section-divider">
                        <h3 className="guide-result-section-divider__title">{step.sectionTitle}</h3>
                      </div>
                    ) : null}
                    <StepDetailCard number={step.number} summary={step.summary} text={step.text} />
                  </section>
                ))}
              </div>

              {mergedPrepare.length > 0 ? (
                <div className="guide-result-block" id="guide-prepare">
                  <h3 className="guide-result-block__title">{uiCopy.guide.whatToPrepare}</h3>
                  <ul className="detail-list">
                    {mergedPrepare.map((item) => (
                      <li key={item.id} className="detail-list__item">{item.text}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {mergedHelp.length > 0 ? (
                <div className="guide-result-block" id="guide-help">
                  <h3 className="guide-result-block__title">{uiCopy.guide.whereToGetHelp}</h3>
                  <ul className="detail-list">
                    {mergedHelp.map((item) => (
                      <li key={item.id} className="detail-list__item">{item.text}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {relatedCases.length > 0 ? (
                <section className="detail-result-related">
                  <div className="detail-section__header detail-section__header--compact">
                    <h2 className="detail-section__title">{uiCopy.guide.relatedCases}</h2>
                  </div>
                  <div className="case-related__grid">
                    {relatedCases.map((caseItem) => (
                      <InteractiveCardButton
                        key={caseItem.id}
                        className="content-card content-card--interactive"
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                      >
                        <CaseCategoryTag category={caseItem.category} label={caseItem.categoryLabel} className="content-card__eyebrow" />
                        <p className="content-card__title">{caseItem.title}</p>
                        <p className="content-card__description">{caseItem.summary}</p>
                      </InteractiveCardButton>
                    ))}
                  </div>
                </section>
              ) : null}
            </section>
          )}
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          {isComplete ? (
            <>
              <div className="detail-page__rail-actions">
                <button className="detail-page__rail-action" type="button" onClick={restartQuestionnaire}>
                  <span className="detail-page__rail-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                      <path d="M480-80q-134 0-227-93T160-400q0-134 93-227t227-93q69 0 132 28.5T720-614v-106h80v280H520v-80h168q-32-56-87.5-88T480-640q-100 0-170 70t-70 170q0 100 70 170t170 70q68 0 124.5-34.5T692-288h90q-35 95-117 151.5T480-80Z" />
                    </svg>
                  </span>
                  <span className="detail-page__rail-action-label">{uiCopy.guide.startAgain}</span>
                </button>
                <button className="detail-page__rail-action" type="button" onClick={() => window.print()}>
                  <span className="detail-page__rail-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                  </span>
                  <span className="detail-page__rail-action-label">{uiCopy.guide.saveAsPdf}</span>
                </button>
              </div>
              <nav className="detail-page-nav" aria-label={uiCopy.guide.onThisPage}>
                {resultNavItems.map((s, index) => (
                  <InteractiveCardButton
                    key={s.id}
                    className={`detail-page-nav__item${activeSectionId === s.id ? " detail-page-nav__item--active" : ""}`}
                    onClick={() => handleSectionNavigate(s.id)}
                  >
                    <span className="detail-page-nav__number">{index + 1}</span>
                    <span className="detail-page-nav__label">{s.title}</span>
                  </InteractiveCardButton>
                ))}
              </nav>
            </>
          ) : (
            <div className="detail-page__rail-placeholder" aria-hidden="true" />
          )}
        </aside>
      </div>

      <QuickCheckExitDialog isOpen={isExitDialogOpen} onStay={handleStayInQuestionnaire} onLeave={handleLeaveQuestionnaire} />
    </section>
  );
}
