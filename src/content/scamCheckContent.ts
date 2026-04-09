import { DEFAULT_LOCALE, type AppLocale } from "../i18n/config";
import scamCheckEn from "../locales/en/scam-check.json";
import type { DetailSectionMeta, ScamActionCard, ScamJourney, ScamJourneyKey, ScamPageContent } from "../types/scam";

const SCAM_PAGE_CONTENT_BY_LOCALE: Record<AppLocale, ScamPageContent> = {
  en: scamCheckEn as ScamPageContent
};

export function getScamPageContent(locale: AppLocale = DEFAULT_LOCALE): ScamPageContent {
  return SCAM_PAGE_CONTENT_BY_LOCALE[locale] ?? SCAM_PAGE_CONTENT_BY_LOCALE[DEFAULT_LOCALE];
}

export function getScamSectionTitle(
  sections: DetailSectionMeta[],
  sectionId: string,
  journeyKey: ScamJourneyKey
): string {
  if (sectionId === "first-judgement") {
    return journeyKey === "unsure" ? "How serious does this look?" : "What matters most right now?";
  }

  return sections.find((section) => section.id === sectionId)?.title ?? "";
}

export function getScamActionCards(content: ScamPageContent, journey: ScamJourney): ScamActionCard[] {
  const journeyCopy = content.actionCards[journey.key];

  return [
    {
      id: "signals",
      number: "1",
      eyebrow: journeyCopy.signalsEyebrow,
      title: journeyCopy.signalsTitle,
      items: journey.signals
    },
    {
      id: "actions",
      number: "2",
      eyebrow: content.actionCards.actionsEyebrow,
      title: content.actionCards.actionsTitle,
      items: journey.actions,
      ordered: true
    },
    {
      id: "evidence",
      number: "3",
      eyebrow: content.actionCards.evidenceEyebrow,
      title: content.actionCards.evidenceTitle,
      items: journey.evidence
    },
    {
      id: "escalation",
      number: "4",
      eyebrow: content.actionCards.escalationEyebrow,
      title: content.actionCards.escalationTitle,
      items: journey.escalation
    }
  ];
}
