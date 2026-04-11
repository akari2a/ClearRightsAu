import { useEffect, useMemo, useState } from "react";
import {
  createFallbackActionPack,
  getActionPackForStage,
  getLocalizedText,
  hasUsableActionPackContent,
  resolveActionItemText,
  resolveHighestPriorityStage,
  resolveMatchingStages,
  SCAM_QUESTIONNAIRE
} from "../../content/quick-check/scam";
import { DEFAULT_LOCALE } from "../../i18n/config";
import type { QuickCheckActionPack, QuickCheckAnswers, QuickCheckQuestion, QuickCheckStage } from "../../types/quickCheck";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";

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
  const [answers, setAnswers] = useState<QuickCheckAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("questionnaire");

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
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
      (actionPack?.steps ?? []).map((step, index) => ({
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

  const handleOptionSelect = (question: QuickCheckQuestion, optionId: string) => {
    setAnswers((current) => ({
      ...current,
      [question.id]: optionId
    }));
  };

  const handleAdvance = () => {
    if (!currentQuestion || !currentAnswer) {
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      setIsComplete(true);
      setTimeout(() => {
        handleSectionNavigate("action-plan");
      }, 50);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handleGoBack = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setActiveSectionId("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const questionnaireProgress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    if (isComplete) {
      return 100;
    }

    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, isComplete, questions.length]);

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__content">
          <div className="detail-page__hero">
            <div className="detail-page__intro">
              <h1 className="detail-page__title">{isComplete ? "What to do next" : "Check your situation"}</h1>
              <p className="detail-page__summary">
                {isComplete
                  ? "Your answers have been turned into the next steps you should focus on now."
                  : "Answer a few questions about what happened. We will use the facts you know to guide the next steps."}
              </p>
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
                  <h3 className="questionnaire-panel__title">{getLocalizedText(currentQuestion.title, locale)}</h3>
                </div>

                <div className="questionnaire-options">
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;

                    return (
                      <InteractiveCardButton
                        key={option.id}
                        className={`questionnaire-option${isSelected ? " questionnaire-option--active" : ""}`}
                        onClick={() => handleOptionSelect(currentQuestion, option.id)}
                      >
                        <span className="questionnaire-option__title">{getLocalizedText(option.label, locale)}</span>
                      </InteractiveCardButton>
                    );
                  })}
                </div>

                <div className="questionnaire-panel__actions">
                  {currentQuestionIndex > 0 ? (
                    <button className="questionnaire-back" type="button" onClick={handleGoBack}>
                      Back
                    </button>
                  ) : null}
                  <button
                    className="questionnaire-advance"
                    type="button"
                    onClick={handleAdvance}
                    disabled={!currentAnswer}
                  >
                    {currentQuestionIndex === questions.length - 1 ? "Complete" : "Next"}
                  </button>
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
                <button className="detail-result-intro__restart" type="button" onClick={handleRestart}>
                  Start again
                </button>
              </div>

              <div className="detail-step-list">
                {flattenedSteps.map((step) => (
                  <section key={step.id} id={step.id}>
                    <ResultStepCard number={step.number} text={step.text} />
                  </section>
                ))}
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
    </section>
  );
}
