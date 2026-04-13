import type { AppLocale } from "../i18n/config";
import type { SuccessCase } from "./case";
import type { QuickCheckActionItem, QuickCheckAnswers, QuickCheckQuestion } from "./quickCheck";

export type GuideResult = {
  readonly primaryResultId: string;
  readonly primaryLabel: string;
  readonly primarySummary: string;
  readonly riskLevel: number;
  readonly overlayIds: readonly string[];
};

export type GuideResultSection = {
  readonly sectionId: string;
  readonly role: "evidence" | "escalation" | "primary" | "guidance";
  readonly title: string;
  readonly summary: string;
  readonly steps: readonly QuickCheckActionItem[];
  readonly prepare?: readonly QuickCheckActionItem[];
  readonly help?: readonly QuickCheckActionItem[];
};

export type GuideScenarioConfig = {
  readonly scenarioId: string;
  readonly basePath: string;
  readonly pageTitle: string;
  readonly pageIntro: string;
  readonly resultsTitle: string;
  readonly relatedCasesTitle: string;
  readonly questionnaireProgressLabel: string;
  readonly questions: readonly QuickCheckQuestion[];
  readonly resolveResult: (answers: QuickCheckAnswers, locale?: AppLocale) => GuideResult | null;
  readonly getResultSections: (
    result: GuideResult,
    answers: QuickCheckAnswers,
    locale?: AppLocale
  ) => readonly GuideResultSection[];
  readonly relatedCasesFilter: (caseItem: SuccessCase) => boolean;
  readonly resolveActionItemText: (item: QuickCheckActionItem, answers: QuickCheckAnswers, locale?: AppLocale) => string;
  readonly resolveActionItemSummary: (item: QuickCheckActionItem, locale?: AppLocale) => string;
  readonly shouldDisplayActionItem: (item: QuickCheckActionItem, answers: QuickCheckAnswers) => boolean;
};
