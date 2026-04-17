import type { GuideScenarioConfig } from "../../../types/guide";
import {
  REFUND_QUESTIONNAIRE,
  resolveRefundResult,
  getRefundResultSections,
  resolveActionItemText,
  resolveActionItemSummary,
  shouldDisplayActionItem
} from "../../../content/quick-check/refund";

export const refundScenarioConfig: GuideScenarioConfig = {
  scenarioId: "refund",
  basePath: "/refund-check",
  pageTitle: "Check your situation",
  pageIntro:
    "Answer a few questions about what happened. We will use the facts you know to guide the next steps.",
  resultsTitle: "What to do next",
  relatedCasesTitle: "Related cases",
  questionnaireProgressLabel: "Questionnaire progress",
  showResultSummaryCard: false,
  questions: REFUND_QUESTIONNAIRE.questionFlow,
  resolveResult: resolveRefundResult,
  getResultSections: getRefundResultSections,
  relatedCasesFilter: (c) => c.category === "refund" || c.category === "tenancy",
  resolveActionItemText,
  resolveActionItemSummary,
  shouldDisplayActionItem
};
