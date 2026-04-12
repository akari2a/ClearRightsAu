import type { AppLocale } from "../i18n/config";

export type QuickCheckLocalizedText = Partial<Record<AppLocale, string>>;

export type QuickCheckQuestionOption = {
  id: string;
  label: QuickCheckLocalizedText;
};

export type QuickCheckQuestion = {
  id: string;
  title: QuickCheckLocalizedText;
  description: QuickCheckLocalizedText;
  selectionMode: "single" | "multiple";
  exclusiveOptionIds?: string[];
  options: QuickCheckQuestionOption[];
};

export type QuickCheckQuestionFile = {
  scenarioId: string;
  questionFlow: QuickCheckQuestion[];
};

export type QuickCheckStage = {
  id: string;
  label: QuickCheckLocalizedText;
  priority: number;
  riskLevel?: number;
  stageLayer?: "primary" | "overlay";
  affectedBy: Record<string, string[]>;
};

export type QuickCheckStageFile = {
  scenarioId: string;
  stages: QuickCheckStage[];
};

export type QuickCheckPlainTextContent = {
  type: "plain_text";
  text: QuickCheckLocalizedText;
};

export type QuickCheckFormatArgument = {
  default: QuickCheckLocalizedText;
  fromQuestion: string;
  map: Record<string, QuickCheckLocalizedText>;
};

export type QuickCheckFormatTextContent = {
  type: "format_text";
  template: QuickCheckLocalizedText;
  arguments: Record<string, QuickCheckFormatArgument>;
};

export type QuickCheckActionItem = {
  id: string;
  kind: "step";
  summary: QuickCheckLocalizedText;
  showWhen?: Array<{
    questionId: string;
    includesAny: string[];
  }>;
  content: QuickCheckPlainTextContent | QuickCheckFormatTextContent;
};

export type QuickCheckActionPack = {
  stageId: string;
  resultTitle: QuickCheckLocalizedText;
  resultSummary: QuickCheckLocalizedText;
  steps: QuickCheckActionItem[];
  prepare?: QuickCheckActionItem[];
  help?: QuickCheckActionItem[];
};

export type QuickCheckActionPackFile = {
  scenarioId: string;
  actionPacks: QuickCheckActionPack[];
};

export type QuickCheckAnswerValue = string | string[];

export type QuickCheckAnswers = Record<string, QuickCheckAnswerValue>;
