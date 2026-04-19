import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuickCheckAnswers, QuickCheckQuestion } from "../types/quickCheck";

type GuideQuestionnaireOptions = {
  questions: QuickCheckQuestion[];
  basePath: string;
  isComplete: boolean;
  onComplete: () => void;
  onShowResults: () => void;
  onRestoreResult: (answers: QuickCheckAnswers) => void;
};

type GuideQuestionnaireHistoryState = {
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
): GuideQuestionnaireHistoryState {
  return {
    quickCheckSessionId: sessionId,
    quickCheckQuestionIndex: questionIndex,
    quickCheckResultView: options?.resultView ?? false,
    quickCheckEntryType: options?.entryType ?? "question"
  };
}

type ParsedQuestionnaireUrlState = {
  answers: QuickCheckAnswers;
  questionIndex: number;
  resultView: boolean;
  hasExplicitState: boolean;
};

function clampQuestionIndex(index: number, questionCount: number) {
  if (questionCount === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), questionCount - 1);
}

function isValidOptionId(question: QuickCheckQuestion, optionId: string) {
  return question.options.some((option) => option.id === optionId);
}

function parseAnswerFromSearchParams(searchParams: URLSearchParams, question: QuickCheckQuestion) {
  const rawValue = searchParams.get(question.id);

  if (!rawValue) {
    return undefined;
  }

  if (question.selectionMode === "multiple") {
    const values = rawValue
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && isValidOptionId(question, value));

    return values.length > 0 ? values : undefined;
  }

  return isValidOptionId(question, rawValue) ? rawValue : undefined;
}

function createQuestionnaireSearchParams(
  answers: QuickCheckAnswers,
  questions: QuickCheckQuestion[],
  options?: {
    questionIndex?: number;
    resultView?: boolean;
  }
) {
  const searchParams = new URLSearchParams();

  questions.forEach((question) => {
    const answer = answers[question.id];

    if (Array.isArray(answer) && answer.length > 0) {
      searchParams.set(question.id, answer.join(","));
      return;
    }

    if (typeof answer === "string" && answer.length > 0) {
      searchParams.set(question.id, answer);
    }
  });

  if (options?.resultView) {
    searchParams.set("view", "result");
  } else {
    searchParams.set("step", String(clampQuestionIndex(options?.questionIndex ?? 0, questions.length)));
  }

  return searchParams;
}

function buildQuestionnaireUrl(
  answers: QuickCheckAnswers,
  questions: QuickCheckQuestion[],
  options?: {
    questionIndex?: number;
    resultView?: boolean;
  }
) {
  const search = createQuestionnaireSearchParams(answers, questions, options).toString();

  return search.length > 0 ? `${window.location.pathname}?${search}` : window.location.pathname;
}

export function parseQuestionnaireUrlState(
  search: string,
  questions: QuickCheckQuestion[]
): ParsedQuestionnaireUrlState {
  const searchParams = new URLSearchParams(search);
  const answers: QuickCheckAnswers = {};

  questions.forEach((question) => {
    const answer = parseAnswerFromSearchParams(searchParams, question);

    if (answer !== undefined) {
      answers[question.id] = answer;
    }
  });

  const resultView = searchParams.get("view") === "result";
  const rawQuestionIndex = Number.parseInt(searchParams.get("step") ?? "0", 10);
  const questionIndex = clampQuestionIndex(Number.isNaN(rawQuestionIndex) ? 0 : rawQuestionIndex, questions.length);
  const hasExplicitState =
    searchParams.has("view") ||
    searchParams.has("step") ||
    questions.some((question) => searchParams.has(question.id));

  return {
    answers,
    questionIndex,
    resultView,
    hasExplicitState
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

export function useGuideQuestionnaire({
  questions,
  basePath,
  isComplete,
  onComplete,
  onShowResults,
  onRestoreResult
}: GuideQuestionnaireOptions) {
  const navigate = useNavigate();
  const initialUrlStateRef = useRef<ParsedQuestionnaireUrlState>(parseQuestionnaireUrlState(window.location.search, questions));
  const [answers, setAnswers] = useState<QuickCheckAnswers>(initialUrlStateRef.current.answers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialUrlStateRef.current.questionIndex);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const isCollapsingHistoryRef = useRef(false);
  const isLeavingQuestionnaireRef = useRef(false);
  const pendingQuestionBackRef = useRef<number | null>(null);
  const quickCheckSessionIdRef = useRef(`quick-check-${Date.now()}`);
  const questionnaireExitFallbackRef = useRef("/");
  const completionTimeoutRef = useRef<number | null>(null);
  const answersRef = useRef<QuickCheckAnswers>(initialUrlStateRef.current.answers);
  const questionIndexRef = useRef(initialUrlStateRef.current.questionIndex);
  const onShowResultsRef = useRef(onShowResults);
  const onRestoreResultRef = useRef(onRestoreResult);
  const basePathRef = useRef(basePath);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const currentSelectionCount = getSelectedOptionCount(currentAnswer);
  const isMultiSelectQuestion = currentQuestion.selectionMode === "multiple";

  useEffect(() => {
    onShowResultsRef.current = onShowResults;
  }, [onShowResults]);

  useEffect(() => {
    onRestoreResultRef.current = onRestoreResult;
  }, [onRestoreResult]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const nextUrl = buildQuestionnaireUrl(answers, questions, { questionIndex: currentQuestionIndex });
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl === nextUrl) {
      return;
    }

    const currentState = (window.history.state ?? {}) as Partial<GuideQuestionnaireHistoryState>;
    const nextState =
      currentState.quickCheckSessionId === quickCheckSessionIdRef.current
        ? {
            ...currentState,
            quickCheckQuestionIndex: currentQuestionIndex,
            quickCheckResultView: false,
            quickCheckEntryType: "question"
          }
        : createQuickCheckHistoryState(quickCheckSessionIdRef.current, currentQuestionIndex);

    navigate(nextUrl, { replace: true, state: nextState });
  }, [answers, currentQuestionIndex, isComplete, navigate, questions]);

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

    if (initialUrlStateRef.current.resultView) {
      const resultUrl = buildQuestionnaireUrl(initialUrlStateRef.current.answers, questions, {
        resultView: true
      });
      navigate(resultUrl, {
        replace: true,
        state: createQuickCheckHistoryState(sessionId, 0, {
          resultView: true,
          entryType: "result"
        })
      });
      onRestoreResultRef.current(initialUrlStateRef.current.answers);
      window.setTimeout(() => {
        onShowResultsRef.current();
      }, 0);
      return;
    }

    if (!initialUrlStateRef.current.hasExplicitState) {
      window.history.replaceState(createQuickCheckHistoryState(sessionId, 0, { entryType: "base" }), "", window.location.pathname);
      navigate(buildQuestionnaireUrl(initialUrlStateRef.current.answers, questions, { questionIndex: 0 }), {
        state: createQuickCheckHistoryState(sessionId, 0)
      });
      return;
    }

    window.history.replaceState(createQuickCheckHistoryState(sessionId, 0, { entryType: "base" }), "", window.location.pathname);
    navigate(
      buildQuestionnaireUrl(initialUrlStateRef.current.answers, questions, {
        questionIndex: initialUrlStateRef.current.questionIndex
      }),
      {
        state: createQuickCheckHistoryState(sessionId, initialUrlStateRef.current.questionIndex)
      }
    );
  }, [navigate, questions]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = (event.state ?? {}) as Partial<GuideQuestionnaireHistoryState>;

      if (isLeavingQuestionnaireRef.current) {
        isLeavingQuestionnaireRef.current = false;
        return;
      }

      if (state.quickCheckSessionId !== quickCheckSessionIdRef.current) {
        return;
      }

      if (pendingQuestionBackRef.current !== null) {
        const nextQuestionIndex = pendingQuestionBackRef.current;
        pendingQuestionBackRef.current = null;
        setIsExitDialogOpen(false);
        setAnswers((currentAnswers) => {
          const nextAnswers = clearAnswersFromQuestionIndex(currentAnswers, questions, nextQuestionIndex);
          navigate(buildQuestionnaireUrl(nextAnswers, questions, { questionIndex: nextQuestionIndex }), {
            replace: true,
            state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, nextQuestionIndex)
          });
          return nextAnswers;
        });
        setCurrentQuestionIndex(nextQuestionIndex);
        return;
      }

      if (isCollapsingHistoryRef.current) {
        const resultUrl = buildQuestionnaireUrl(answersRef.current, questions, { resultView: true });
        navigate(resultUrl, {
          replace: true,
          state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0, {
            resultView: true,
            entryType: "result"
          })
        });
        isCollapsingHistoryRef.current = false;
        setCurrentQuestionIndex(0);
        window.setTimeout(() => {
          onShowResultsRef.current();
        }, 50);
        return;
      }

      if (!isComplete && state.quickCheckEntryType === "result") {
        const restoredAnswers = parseQuestionnaireUrlState(window.location.search, questions).answers;
        setAnswers(restoredAnswers);
        onRestoreResultRef.current(restoredAnswers);
        window.setTimeout(() => {
          onShowResultsRef.current();
        }, 50);
        return;
      }

      if (isComplete) {
        return;
      }

      if (state.quickCheckEntryType === "base" && state.quickCheckQuestionIndex === 0) {
        window.history.pushState(
          createQuickCheckHistoryState(quickCheckSessionIdRef.current, questionIndexRef.current),
          "",
          buildQuestionnaireUrl(answersRef.current, questions, { questionIndex: questionIndexRef.current })
        );
        setIsExitDialogOpen(true);
        return;
      }

      if (typeof state.quickCheckQuestionIndex === "number") {
        const nextQuestionIndex = state.quickCheckQuestionIndex;
        setAnswers((currentAnswers) => {
          const nextAnswers = clearAnswersFromQuestionIndex(currentAnswers, questions, nextQuestionIndex);
          navigate(buildQuestionnaireUrl(nextAnswers, questions, { questionIndex: nextQuestionIndex }), {
            replace: true,
            state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, nextQuestionIndex)
          });
          return nextAnswers;
        });
        setCurrentQuestionIndex(nextQuestionIndex);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isComplete, navigate, questions]);

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

    navigate(buildQuestionnaireUrl(answersRef.current, questions, { questionIndex: nextQuestionIndex }), {
      state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, nextQuestionIndex)
    });
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

    const nextQuestionIndex = currentQuestionIndex - 1;
    pendingQuestionBackRef.current = nextQuestionIndex;

    setAnswers((currentAnswers) => {
      const nextAnswers = clearAnswersFromQuestionIndex(currentAnswers, questions, nextQuestionIndex);
      navigate(buildQuestionnaireUrl(nextAnswers, questions, { questionIndex: nextQuestionIndex }), {
        replace: true,
        state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, nextQuestionIndex)
      });
      return nextAnswers;
    });
    setCurrentQuestionIndex(nextQuestionIndex);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsExitDialogOpen(false);
    navigate(buildQuestionnaireUrl({}, questions, { questionIndex: 0 }), {
      state: createQuickCheckHistoryState(quickCheckSessionIdRef.current, 0)
    });
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
      if (window.location.pathname === basePathRef.current) {
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
