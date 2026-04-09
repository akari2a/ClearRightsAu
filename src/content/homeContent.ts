import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import homeEn from "../locales/en/home.json";
import type { HomePageContent } from "../types/home";

const HOME_PAGE_CONTENT_BY_LOCALE: Record<AppLocale, HomePageContent> = {
  en: homeEn as HomePageContent
};

export function getHomePageContent(locale: AppLocale = DEFAULT_LOCALE): HomePageContent {
  return HOME_PAGE_CONTENT_BY_LOCALE[locale] ?? HOME_PAGE_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}
