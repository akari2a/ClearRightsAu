import type { GuideScenarioConfig } from "../../../types/guide";
import {
  UNSAFE_PRODUCTS_QUESTIONNAIRE,
  resolveUnsafeProductsResult,
  getUnsafeProductsResultSections,
  resolveActionItemText,
  resolveActionItemSummary,
  shouldDisplayActionItem
} from "../../../content/quick-check/unsafe-products";

export const unsafeProductsScenarioConfig: GuideScenarioConfig = {
  scenarioId: "unsafe_products",
  basePath: "/unsafe-products-check",
  pageTitle: "Check your situation",
  pageIntro:
    "Answer a few questions about the product. We will help you work out what to do next.",
  resultsTitle: "What to do next",
  relatedCasesTitle: "Related cases",
  questionnaireProgressLabel: "Questionnaire progress",
  questions: UNSAFE_PRODUCTS_QUESTIONNAIRE.questionFlow,
  resolveResult: resolveUnsafeProductsResult,
  getResultSections: getUnsafeProductsResultSections,
  relatedCasesFilter: (c) => c.category === "product-safety",
  resolveActionItemText,
  resolveActionItemSummary,
  shouldDisplayActionItem
};
