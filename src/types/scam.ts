export type ScamJourneyKey = "unsure" | "affected";

export type ScamRiskTone = "warning" | "danger";

export type ScamJourney = {
  key: ScamJourneyKey;
  optionLabel: string;
  optionDescription: string;
  summary: string;
  riskLabel?: string;
  riskTone?: ScamRiskTone;
  headline: string;
  cardText: string;
  signals: string[];
  actions: string[];
  evidence: string[];
  escalation: string[];
  cases: string[];
};

export type DetailSectionMeta = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
};

export type ScamActionCard = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  items: string[];
  ordered?: boolean;
};

export type ScamActionCardCopy = {
  signalsEyebrow: string;
  signalsTitle: string;
};

export type ScamActionCardsCopy = {
  unsure: ScamActionCardCopy;
  affected: ScamActionCardCopy;
  actionsEyebrow: string;
  actionsTitle: string;
  evidenceEyebrow: string;
  evidenceTitle: string;
  escalationEyebrow: string;
  escalationTitle: string;
};

export type ScamPageContent = {
  pageTitle: string;
  caseEyebrow: string;
  sections: DetailSectionMeta[];
  journeys: ScamJourney[];
  actionCards: ScamActionCardsCopy;
};
