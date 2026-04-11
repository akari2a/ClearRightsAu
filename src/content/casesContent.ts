import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import casesEn from "../locales/en/cases.json";
import type { CasesPageContent, SuccessCase } from "../types/case";

const CASES_CONTENT_BY_LOCALE: Record<AppLocale, CasesPageContent> = {
  en: casesEn as CasesPageContent
};

export function getCasesPageContent(locale: AppLocale = DEFAULT_LOCALE): CasesPageContent {
  return CASES_CONTENT_BY_LOCALE[locale] ?? CASES_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}

export function getCaseById(content: CasesPageContent, caseId: string): SuccessCase | undefined {
  return content.cases.find((c) => c.id === caseId);
}
