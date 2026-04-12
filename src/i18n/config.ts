export type AppLocale = "en" | "zh-Hans";

export const DEFAULT_LOCALE: AppLocale = "en";

export const SUPPORTED_LOCALES: readonly AppLocale[] = ["en", "zh-Hans"];

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}
