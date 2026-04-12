import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import aibotEn from "../locales/en/aibot.json";
import type { AibotPageContent } from "../types/aibot";

const AIBOT_CONTENT_BY_LOCALE: Record<AppLocale, AibotPageContent> = {
  en: aibotEn as AibotPageContent
};

export function getAibotPageContent(locale: AppLocale = DEFAULT_LOCALE): AibotPageContent {
  return AIBOT_CONTENT_BY_LOCALE[locale] ?? AIBOT_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}
