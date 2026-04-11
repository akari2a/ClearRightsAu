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
  selectionMode: "single";
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
  content: QuickCheckPlainTextContent | QuickCheckFormatTextContent;
};

export type QuickCheckActionPack = {
  stageId: string;
  resultTitle: QuickCheckLocalizedText;
  resultSummary: QuickCheckLocalizedText;
  steps: QuickCheckActionItem[];
};

export type QuickCheckActionPackFile = {
  scenarioId: string;
  actionPacks: QuickCheckActionPack[];
};

export type QuickCheckAnswers = Record<string, string>;
