import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuickCheckAnswers, QuickCheckQuestion } from "../../../types/quickCheck";

type ScamQuestionnaireOptions = {
  questions: QuickCheckQuestion[];
  isComplete: boolean;
  onComplete: () => void;
  onShowResults: () => void;
};

type ScamQuestionnaireHistoryState = {
  quickCheckSessionId: string;
  quickCheckQuestionIndex: number;
  quickCheckResultView: boolean;
  quickCheckEntryType: "base" | "question" | "result";
};

function createQuickCheckHistoryState(
  sessionId: string,
  questionIndex: number,
  options?: {
    resultView?: boolean;
    entryType?: "base" | "question" | "result";
  }
): ScamQuestionnaireHistoryState {
  return {
    quickCheckSessionId: sessionId,
    quickCheckQuestionIndex: questionIndex,
    quickCheckResultView: options?.resultView ?? false,
    quickCheckEntryType: options?.entryType ?? "question"
  };
}

function getSelectedOptionCount(answer: QuickCheckAnswers[string] | undefined) {
  if (Array.isArray(answer)) {
    return answer.length;
  }

  return answer ? 1 : 0;
}

function getExclusiveOptionIds(question: QuickCheckQuestion) {
  return question.exclusiveOptionIds ?? [];
}

function clearAnswersFromQuestionIndex(
  currentAnswers: QuickCheckAnswers,
  questions: QuickCheckQuestion[],
  fromIndex: number
) {
  const nextAnswers = { ...currentAnswers };

  questions.slice(fromIndex).forEach((question) => {
    delete nextAnswers[question.id];
  });

  return nextAnswers;
}

export function isOptionSelected(answer: QuickCheckAnswers[string] | undefined, optionId: string) {
  if (Array.isArray(answer)) {
    return answer.includes(optionId);
  }

  return answer === optionId;
}

export function useScamQuestionnaire({
  questions,
  isComplete,
  onComplete,
  onShowResults
}: ScamQuestionnaireOptions) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<QuickCheckAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const isCollapsingHistoryRef = useRef(false);
  const isLeavingQuestionnaireRef = useRef(false);
  const quickCheckSessionIdRef = useRef(`quick-check-${Date.now()}`);
  const questionnaireExitFallbackRef = useRef("/");
  const completionTimeoutRef = useRef<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const currentSelectionCount = getSelectedOptionCount(currentAnswer);
  const isMultiSelectQuestion = currentQuestion.selectionMode === "multiple";

  useEffect(() => {
    const sessionId = quickCheckSessionIdRef.current;
    const referrer = document.referrer;

    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);

        if (referrerUrl.origin === window.location.origin && referrerUrl.pathname !== window.location.pathname) {
          questionnaireExitFallbackRef.current = `${referrerUrl.pathname}${referrerUrl.search}${referrerUrl.hash}`;
        }
      } catch {
        questionnaireExitFallbackRef.current = "/";
      }
    }

    window.history.replaceState(createQuickCheckHistoryState(sessionId, 0, { entryType: "base" }), "", window.location.href);
    window.history.pushState(createQuickCheckHistoryState(sessionId, 0), "", window.location.href);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = (event.state ?? {}) as Partial<ScamQuestionnaireHistoryState>;

      if (isLeavingQuestionnaireRef.current) {
        isLeavingQuestionnaireRef.current = false;
        return;
      }

      if (state.quickCheckSessionId !== quickCheckSessionIdRef.current) {
        return;
      }

      if (isCollapsingHistoryRef.current) {
        window.history.replaceState(
          createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0, {
            resultView: true,
            entryType: "result"
          }),
          "",
          window.location.href
        );
        isCollapsingHistoryRef.current = false;
        setCurrentQuestionIndex(0);
        window.setTimeout(() => {
          onShowResults();
        }, 50);
        return;
      }

      if (isComplete) {
        return;
      }

      if (state.quickCheckEntryType === "base" && state.quickCheckQuestionIndex === 0) {
        window.history.pushState(createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0), "", window.location.href);
        setIsExitDialogOpen(true);
        return;
      }

      if (typeof state.quickCheckQuestionIndex === "number") {
        setAnswers((currentAnswers) => clearAnswersFromQuestionIndex(currentAnswers, questions, state.quickCheckQuestionIndex ?? 0));
        setCurrentQuestionIndex(state.quickCheckQuestionIndex);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isComplete, onShowResults, questions]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  const questionnaireProgress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    if (isComplete) {
      return 100;
    }

    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, isComplete, questions.length]);

  const advanceQuestionnaire = () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (isLastQuestion) {
      onComplete();
      isCollapsingHistoryRef.current = true;
      window.history.go(-(currentQuestionIndex + 1));
      return;
    }

    window.history.pushState(
      createQuickCheckHistoryState(quickCheckSessionIdRef.current, nextQuestionIndex),
      "",
      window.location.href
    );
    setCurrentQuestionIndex(nextQuestionIndex);
  };

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.selectionMode === "multiple") {
      setAnswers((current) => {
        const previousAnswer = current[currentQuestion.id];
        const previousSelections = Array.isArray(previousAnswer)
          ? previousAnswer
          : previousAnswer
            ? [previousAnswer]
            : [];
        const exclusiveOptionIds = getExclusiveOptionIds(currentQuestion);
        const isExclusiveOption = exclusiveOptionIds.includes(optionId);
        const currentlySelected = previousSelections.includes(optionId);
        let nextSelections: string[];

        if (isExclusiveOption) {
          nextSelections = currentlySelected ? [] : [optionId];
        } else {
          const nonExclusiveSelections = previousSelections.filter((selection) => !exclusiveOptionIds.includes(selection));
          nextSelections = currentlySelected
            ? nonExclusiveSelections.filter((selection) => selection !== optionId)
            : [...nonExclusiveSelections, optionId];
        }

        return {
          ...current,
          [currentQuestion.id]: nextSelections
        };
      });
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId
    }));

    completionTimeoutRef.current = window.setTimeout(() => {
      advanceQuestionnaire();
    }, 500);
  };

  const handleContinue = () => {
    if (!isMultiSelectQuestion || currentSelectionCount === 0) {
      return;
    }

    advanceQuestionnaire();
  };

  const handleGoBack = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    window.history.back();
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsExitDialogOpen(false);
    window.history.replaceState(createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0, { entryType: "base" }), "", window.location.href);
    window.history.pushState(createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0), "", window.location.href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStayInQuestionnaire = () => {
    setIsExitDialogOpen(false);
  };

  const handleLeaveQuestionnaire = () => {
    setIsExitDialogOpen(false);
    isLeavingQuestionnaireRef.current = true;
    window.history.go(-2);

    window.setTimeout(() => {
      if (window.location.pathname === "/scam-check") {
        navigate(questionnaireExitFallbackRef.current, { replace: true });
      }
    }, 180);
  };

  return {
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
  };
}
