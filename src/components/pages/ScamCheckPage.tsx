import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCasesPageContent } from "../../content/casesContent";
import {
  createFallbackActionPack,
  getActionPackForStage,
  getLocalizedText,
  hasUsableActionPackContent,
  resolveActionItemSummary,
  resolveActionItemText,
  resolveHighestPriorityStage,
  resolveMatchingStages,
  shouldDisplayActionItem,
  SCAM_QUESTIONNAIRE
} from "../../content/quick-check/scam";
import { DEFAULT_LOCALE, type AppLocale } from "../../i18n/config";
import { getUiCopy } from "../../i18n/copy";
import type { QuickCheckActionPack, QuickCheckAnswers, QuickCheckStage } from "../../types/quickCheck";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";
import { CaseCategoryTag } from "../case/CaseCategoryTag";
import { RiskSummaryCard } from "../risk/RiskSummaryCard";
import { createStepPresentation, StepDetailCard } from "../steps/StepDetailCard";
import { QuickCheckExitDialog } from "./scam-check/QuickCheckExitDialog";
import {
  isOptionSelected,
  parseQuestionnaireUrlState,
  useScamQuestionnaire
} from "./scam-check/useScamQuestionnaire";

type ScamCheckPageProps = {
  locale?: AppLocale;
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, stage: QuickCheckStage | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

function getRiskLevelPresentation(riskLevel?: number) {
  if (riskLevel === 0) {
    return { label: "Risk level 0", tone: "low" as const };
  }

  if (riskLevel === 1) {
    return { label: "Risk level 1", tone: "caution" as const };
  }

  if (riskLevel === 2) {
    return { label: "Risk level 2", tone: "warning" as const };
  }

  if (riskLevel === 3) {
    return { label: "Risk level 3", tone: "high" as const };
  }

  if (riskLevel === 4) {
    return { label: "Risk level 4", tone: "danger" as const };
  }

  return { label: "Risk level", tone: "warning" as const };
}

export function ScamCheckPage({
  locale = DEFAULT_LOCALE,
  onQuestionnaireComplete,
  onSectionNavigate
}: ScamCheckPageProps) {
  const navigate = useNavigate();
  const uiCopy = getUiCopy(locale);
  const questions = SCAM_QUESTIONNAIRE.questionFlow;
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
  } = useScamQuestionnaire({
    questions,
    isComplete,
    onComplete: () => setIsComplete(true),
    onShowResults: () => handleSectionNavigate("action-plan"),
    onRestoreResult: () => {
      setIsComplete(true);
      setActiveSectionId("action-plan");
    }
  });
  const currentAnswer = answers[currentQuestion.id];
  const matchingStages = useMemo(() => (isComplete ? resolveMatchingStages(answers) : []), [answers, isComplete]);
  const resolvedStage = useMemo(() => (isComplete ? resolveHighestPriorityStage(answers) : null), [answers, isComplete]);
  const actionPack = useMemo<QuickCheckActionPack | null>(() => {
    if (!resolvedStage) {
      return null;
    }

    const configuredPack = getActionPackForStage(resolvedStage.id);

    if (!configuredPack || !hasUsableActionPackContent(configuredPack)) {
      return createFallbackActionPack(resolvedStage);
    }

    return configuredPack;
  }, [resolvedStage]);
  const resultBadge = useMemo(() => getRiskLevelPresentation(resolvedStage?.riskLevel), [resolvedStage]);
  const flattenedSteps = useMemo(
    () =>
      (actionPack?.steps ?? [])
        .filter((step) => shouldDisplayActionItem(step, answers))
        .map((step, index) => {
          const resolvedSummary = resolveActionItemSummary(step, locale);
          const resolvedText = resolveActionItemText(step, answers, locale);
          const presentation = createStepPresentation(resolvedSummary, resolvedText);

          return {
            id: `result-step-${step.id}`,
            number: index + 1,
            summary: presentation.summary,
            text: presentation.paragraphs.join("\n"),
            navLabel: presentation.summary
          };
        }),
    [actionPack, answers, locale]
  );
  const resultNavItems = useMemo(() => flattenedSteps.map((step) => ({ id: step.id, title: step.navLabel })), [flattenedSteps]);
  const relatedCases = useMemo(
    () => casesContent.cases.filter((caseItem) => caseItem.category === "scam").slice(0, 3),
    [casesContent]
  );

  useEffect(() => {
    if (isComplete) {
      console.log("[Quick Check] Stage resolution", {
        answers,
        matchedStageIds: matchingStages.map((stage) => stage.id),
        matchedStages: matchingStages,
        resolvedStage
      });
      onQuestionnaireComplete?.(answers, resolvedStage);
    }
  }, [answers, isComplete, matchingStages, onQuestionnaireComplete, resolvedStage]);

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
        .map((section) => document.getElementById(section.id))
        .filter(Boolean) as HTMLElement[];

      const viewportAnchor = window.scrollY + window.innerHeight * 0.28;
      let currentSection = sectionElements[0];

      sectionElements.forEach((section) => {
        if (viewportAnchor >= section.offsetTop - 16) {
          currentSection = section;
        }
      });

      if (currentSection) {
        setActiveSectionId(currentSection.id);
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

    if (!section) {
      return;
    }

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

  const saveAsPdf = () => {
    window.print();
  };

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              <h1 className="detail-page__title">{isComplete ? uiCopy.guide.whatToDoNext : uiCopy.guide.checkYourSituation}</h1>
              {!isComplete && (
                <p className="detail-page__summary">
                  {uiCopy.guide.scamIntro}
                </p>
              )}
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
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
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
                  resolvedStage?.riskLevel !== undefined
                    ? `${uiCopy.guide.riskLevelPrefix} ${resolvedStage.riskLevel}`
                    : resultBadge.label
                }
                tone={resultBadge.tone}
                title={
                  resolvedStage
                    ? getLocalizedText(resolvedStage.label, locale)
                    : actionPack
                      ? getLocalizedText(actionPack.resultTitle, locale)
                      : uiCopy.guide.resultFallback
                }
                summary={actionPack ? getLocalizedText(actionPack.resultSummary, locale) : ""}
              />

              <div className="detail-step-list">
                {flattenedSteps.map((step) => (
                  <section key={step.id} id={step.id}>
                    <StepDetailCard number={step.number} summary={step.summary} text={step.text} />
                  </section>
                ))}
              </div>

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
                      <path d="M480-80q-134 0-227-93T160-400q0-134 93-227t227-93q69 0 132 28.5T720-614v-106h80v280H520v-80h168q-32-56-87.5-88T480-640q-100 0-170 70t-70 170q0 100 70 170t170 70q68 0 124.5-34.5T692-288h90q-35 95-117 151.5T480-80Z"/>
                    </svg>
                  </span>
                  <span className="detail-page__rail-action-label">{uiCopy.guide.startAgain}</span>
                </button>
                <button className="detail-page__rail-action" type="button" onClick={saveAsPdf}>
                  <span className="detail-page__rail-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                  </span>
                  <span className="detail-page__rail-action-label">{uiCopy.guide.saveAsPdf}</span>
                </button>
              </div>
              <nav className="detail-page-nav" aria-label={uiCopy.guide.onThisPage}>
                {resultNavItems.map((section, index) => (
                  <InteractiveCardButton
                    key={section.id}
                    className={`detail-page-nav__item${activeSectionId === section.id ? " detail-page-nav__item--active" : ""}`}
                    onClick={() => handleSectionNavigate(section.id)}
                  >
                    <span className="detail-page-nav__number">{index + 1}</span>
                    <span className="detail-page-nav__label">{section.title}</span>
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
