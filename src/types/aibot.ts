export type AibotSuggestedQuestion = {
  text: string;
};

export type AibotPageContent = {
  welcomeHeading: string;
  welcomeSubtext: string;
  suggestedQuestions: AibotSuggestedQuestion[];
  suggestedPills: string[];
  questionsDivider: string;
  inputPlaceholder: string;
  inputDisclaimer: string;
  offlineTitle: string;
  offlineSubtext: string;
  offlineRetryLabel: string;
  offlineFallbackLinks: { label: string; route: string }[];
  trustBadges: string[];
};

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type OllamaStatus = "idle" | "connecting" | "streaming" | "error" | "offline";
