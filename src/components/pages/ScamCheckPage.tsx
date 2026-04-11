import { useEffect, useMemo, useState } from "react";
import {
  createFallbackActionPack,
  getActionPackForStage,
  getLocalizedText,
  hasUsableActionPackContent,
  resolveActionItemText,
  resolveHighestPriorityStage,
  resolveMatchingStages,
  shouldDisplayActionItem,
  SCAM_QUESTIONNAIRE
} from "../../content/quick-check/scam";
import { DEFAULT_LOCALE } from "../../i18n/config";
import type { QuickCheckActionPack, QuickCheckAnswers, QuickCheckStage } from "../../types/quickCheck";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";
import { QuickCheckExitDialog } from "./scam-check/QuickCheckExitDialog";
import { isOptionSelected, useScamQuestionnaire } from "./scam-check/useScamQuestionnaire";

type ScamCheckPageProps = {
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, stage: QuickCheckStage | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

function getResultBadge(stageId?: string) {
  if (stageId === "H" || stageId === "F" || stageId === "G") {
    return { label: "Act now", tone: "danger" as const };
  }

  if (stageId === "D" || stageId === "E" || stageId === "W") {
    return { label: "Take action soon", tone: "warning" as const };
  }

  return { label: "Quick check result", tone: "warning" as const };
}

function ResultStepCard({ number, text }: { number: number; text: string }) {
  return (
    <section className="detail-card detail-card--step">
      <span className="detail-card__floating-index" aria-hidden="true">
        {number}
      </span>
      <p className="detail-card__eyebrow">{`Step ${number}`}</p>
      <p className="detail-card__step-text">{text}</p>
    </section>
  );
}

export function ScamCheckPage({ onQuestionnaireComplete, onSectionNavigate }: ScamCheckPageProps) {
  const locale = DEFAULT_LOCALE;
  const questions = SCAM_QUESTIONNAIRE.questionFlow;
  const [isComplete, setIsComplete] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("questionnaire");
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
    onShowResults: () => handleSectionNavigate("action-plan")
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
  const resultBadge = useMemo(() => getResultBadge(resolvedStage?.id), [resolvedStage]);
  const flattenedSteps = useMemo(
    () =>
      (actionPack?.steps ?? [])
        .filter((step) => shouldDisplayActionItem(step, answers))
        .map((step, index) => ({
        id: `result-step-${step.id}`,
        number: index + 1,
        text: resolveActionItemText(step, answers, locale),
        navLabel: resolveActionItemText(step, answers, locale)
      })),
    [actionPack, answers, locale]
  );
  const resultNavItems = useMemo(() => flattenedSteps.map((step) => ({ id: step.id, title: step.navLabel })), [flattenedSteps]);

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

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              <h1 className="detail-page__title">{isComplete ? "What to do next" : "Check your situation"}</h1>
              {!isComplete && (
                <p className="detail-page__summary">
                  Answer a few questions about what happened. We will use the facts you know to guide the next steps.
                </p>
              )}
            </div>
          </div>

          {!isComplete ? (
            <section className="detail-section" id="questionnaire">
              <div className="questionnaire-progress-block" aria-label="Questionnaire progress">
                <div className="questionnaire-progress-block__copy">
                  <p className="questionnaire-progress-block__label">Questionnaire progress</p>
                  <p className="questionnaire-progress-block__step">
                    {`Step ${Math.min(currentQuestionIndex + 1, questions.length)} of ${questions.length}`}
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
                      Previous step
                    </button>
                    {isMultiSelectQuestion ? (
                      <button
                        className="questionnaire-continue"
                        type="button"
                        onClick={handleContinue}
                        disabled={currentSelectionCount === 0}
                      >
                        Continue
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
              <div className="detail-page__risk-card detail-result-intro">
                <span className={`risk-badge risk-badge--${resultBadge.tone}`}>{resultBadge.label}</span>
                <h3 className="detail-result-intro__title">
                  {actionPack
                    ? getLocalizedText(actionPack.resultTitle, locale)
                    : resolvedStage
                      ? getLocalizedText(resolvedStage.label, locale)
                      : "Result"}
                </h3>
                {actionPack && getLocalizedText(actionPack.resultSummary, locale) ? (
                  <p className="detail-result-intro__summary">{getLocalizedText(actionPack.resultSummary, locale)}</p>
                ) : null}
              </div>

              <div className="detail-step-list">
                {flattenedSteps.map((step) => (
                  <section key={step.id} id={step.id}>
                    <ResultStepCard number={step.number} text={step.text} />
                  </section>
                ))}
              </div>

              <div style={{ marginTop: "40px" }}>
                <button className="detail-result-intro__restart" type="button" onClick={restartQuestionnaire}>
                  Start again
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="detail-page__rail detail-page__rail--side">
          {isComplete ? (
            <nav className="detail-page-nav" aria-label="On this page">
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
          ) : (
            <div className="detail-page__rail-placeholder" aria-hidden="true" />
          )}
        </aside>
      </div>

      <QuickCheckExitDialog isOpen={isExitDialogOpen} onStay={handleStayInQuestionnaire} onLeave={handleLeaveQuestionnaire} />
    </section>
  );
}
