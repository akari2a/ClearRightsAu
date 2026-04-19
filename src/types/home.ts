export type TabKey = "scam" | "refund" | "unsafe";

export type HighlightSegment = {
  text: string;
  highlighted?: boolean;
};

export type BulletItem = {
  id: string;
  segments: HighlightSegment[];
};

export type GuideTab = {
  key: TabKey;
  label: string;
  bullets: BulletItem[];
  quickPills: string[];
  prompt: string;
  actionLabel: string;
  recogniserActionLabel?: string;
};

export type LinkCard = {
  title: string;
  description: string;
  eyebrow?: string;
  category?: "scam" | "refund" | "tenancy";
};

export type HomeSiteCopy = {
  brandName: string;
  slogan: string;
  quickCheckDescription: string;
  chatbotTitle: string;
};

export type HomeResourcesCopy = {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  caseCards: LinkCard[];
};

export type HomePageContent = {
  siteCopy: HomeSiteCopy;
  guideTabs: GuideTab[];
  commonQuestions: string[];
  resources: HomeResourcesCopy;
};
