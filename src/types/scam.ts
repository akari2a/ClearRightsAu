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
