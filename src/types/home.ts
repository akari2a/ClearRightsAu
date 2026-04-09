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
};

export type LinkCard = {
  title: string;
  description: string;
  eyebrow?: string;
};
