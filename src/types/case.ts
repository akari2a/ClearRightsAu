export type CaseCategoryKey = "scam" | "refund" | "product-safety" | "tenancy";

export type CaseRiskTone = "low" | "warning" | "caution" | "danger";

export type CasePersona = {
  name: string;
  age: number;
  background: string;
};

export type CaseActionCard = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  items: string[];
  ordered?: boolean;
};

export type CaseSectionMeta = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
};

export type CaseOutcome = {
  headline: string;
  description: string;
};

export type CaseTakeaway = {
  items: string[];
  relatedGuideLabel: string;
  relatedGuideRoute: string;
};

export type SuccessCase = {
  id: string;
  category: CaseCategoryKey;
  categoryLabel: string;
  title: string;
  summary: string;
  cardImage?: string;
  persona: CasePersona;
  situation: string;
  riskLabel: string;
  riskTone: CaseRiskTone;
  riskHeadline: string;
  riskExplanation: string;
  actionCards: CaseActionCard[];
  outcome: CaseOutcome;
  takeaway: CaseTakeaway;
  relatedCaseIds: string[];
};

export type CaseIndexGroup = {
  categoryKey: CaseCategoryKey;
  categoryLabel: string;
  description: string;
  tintColor: string;
  accentColor: string;
  caseIds: string[];
};

export type CasesPageContent = {
  pageTitle: string;
  pageDescription: string;
  caseEyebrow: string;
  sections: CaseSectionMeta[];
  groups: CaseIndexGroup[];
  cases: SuccessCase[];
};
