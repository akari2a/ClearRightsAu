import actionPacksJson from "./action-packs.json";
import questionsJson from "./questions.json";
import stagesJson from "./stages.json";
import { DEFAULT_LOCALE, type AppLocale } from "../../../i18n/config";
import type {
  QuickCheckActionItem,
  QuickCheckActionPack,
  QuickCheckActionPackFile,
  QuickCheckAnswers,
  QuickCheckFormatTextContent,
  QuickCheckLocalizedText,
  QuickCheckQuestionFile,
  QuickCheckStage,
  QuickCheckStageFile
} from "../../../types/quickCheck";
import type { GuideResult, GuideResultSection } from "../../../types/guide";

export const REFUND_QUESTIONNAIRE = questionsJson as unknown as QuickCheckQuestionFile;
export const REFUND_STAGES = stagesJson as unknown as QuickCheckStageFile;
export const REFUND_ACTION_PACKS = actionPacksJson as unknown as QuickCheckActionPackFile;

export function getLocalizedText(text: QuickCheckLocalizedText, locale: AppLocale = DEFAULT_LOCALE): string {
  return text[locale] ?? text[DEFAULT_LOCALE] ?? Object.values(text)[0] ?? "";
}

function matchesStage(stage: QuickCheckStage, answers: QuickCheckAnswers): boolean {
  return Object.entries(stage.affectedBy).every(([questionId, optionIds]) => {
    const answer = answers[questionId];

    if (Array.isArray(answer)) {
      return answer.some((selectedOptionId) => optionIds.includes(selectedOptionId));
    }

    return answer !== undefined && optionIds.includes(answer);
  });
}

function resolveMatchingStages(answers: QuickCheckAnswers): QuickCheckStage[] {
  return REFUND_STAGES.stages.filter((stage) => matchesStage(stage, answers));
}

function resolvePrimaryStage(answers: QuickCheckAnswers): QuickCheckStage | null {
  const primaryMatches = resolveMatchingStages(answers).filter((s) => s.stageLayer === "primary");

  if (primaryMatches.length === 0) {
    return null;
  }

  return primaryMatches.reduce((best, s) => (s.priority > best.priority ? s : best));
}

function resolveOverlayStages(answers: QuickCheckAnswers): QuickCheckStage[] {
  return resolveMatchingStages(answers).filter((s) => s.stageLayer === "overlay");
}

export function resolveRefundResult(
  answers: QuickCheckAnswers,
  locale: AppLocale = DEFAULT_LOCALE
): GuideResult | null {
  const primary = resolvePrimaryStage(answers);

  if (!primary) {
    return null;
  }

  const overlays = resolveOverlayStages(answers);
  const allRiskLevels = [primary.riskLevel ?? 0, ...overlays.map((o) => o.riskLevel ?? 0)];

  return {
    primaryResultId: primary.id,
    primaryLabel: getLocalizedText(primary.label, locale),
    primarySummary: getActionPackForStage(primary.id)
      ? getLocalizedText(getActionPackForStage(primary.id)!.resultSummary, locale)
      : "",
    riskLevel: Math.max(...allRiskLevels),
    overlayIds: overlays.map((o) => o.id)
  };
}

function getActionPackForStage(stageId: string): QuickCheckActionPack | null {
  return REFUND_ACTION_PACKS.actionPacks.find((pack) => pack.stageId === stageId) ?? null;
}

const OVERLAY_DISPLAY_ORDER: Record<string, { order: number; role: GuideResultSection["role"] }> = {
  E: { order: 1, role: "evidence" },
  H: { order: 2, role: "escalation" },
  C: { order: 4, role: "guidance" },
  W: { order: 4, role: "guidance" }
};

export function getRefundResultSections(
  result: GuideResult,
  _answers: QuickCheckAnswers,
  locale: AppLocale = DEFAULT_LOCALE
): GuideResultSection[] {
  const sections: Array<GuideResultSection & { displayOrder: number }> = [];

  for (const overlayId of result.overlayIds) {
    const pack = getActionPackForStage(overlayId);

    if (!pack) {
      continue;
    }

    const config = OVERLAY_DISPLAY_ORDER[overlayId] ?? { order: 5, role: "guidance" as const };

    sections.push({
      sectionId: `overlay-${overlayId}`,
      role: config.role,
      title: getLocalizedText(pack.resultTitle, locale),
      summary: getLocalizedText(pack.resultSummary, locale),
      steps: pack.steps,
      prepare: pack.prepare,
      help: pack.help,
      displayOrder: config.order
    });
  }

  const primaryPack = getActionPackForStage(result.primaryResultId);

  if (primaryPack) {
    sections.push({
      sectionId: `primary-${result.primaryResultId}`,
      role: "primary",
      title: getLocalizedText(primaryPack.resultTitle, locale),
      summary: getLocalizedText(primaryPack.resultSummary, locale),
      steps: primaryPack.steps,
      prepare: primaryPack.prepare,
      help: primaryPack.help,
      displayOrder: 3
    });
  }

  sections.sort((a, b) => a.displayOrder - b.displayOrder);

  return sections.map(({ displayOrder: _, ...section }) => section);
}

function resolveFormatText(
  content: QuickCheckFormatTextContent,
  answers: QuickCheckAnswers,
  locale: AppLocale
): string {
  let output = getLocalizedText(content.template, locale);

  Object.entries(content.arguments).forEach(([token, config]) => {
    const answer = answers[config.fromQuestion];
    const selectedAnswer = Array.isArray(answer) ? answer[0] : answer;
    const replacement = getLocalizedText(
      (selectedAnswer && config.map[selectedAnswer]) || config.default,
      locale
    );
    output = output.split(`{${token}}`).join(replacement);
  });

  return output;
}

export function resolveActionItemText(
  item: QuickCheckActionItem,
  answers: QuickCheckAnswers,
  locale: AppLocale = DEFAULT_LOCALE
): string {
  if (item.content.type === "plain_text") {
    return getLocalizedText(item.content.text, locale);
  }

  return resolveFormatText(item.content, answers, locale);
}

export function resolveActionItemSummary(
  item: QuickCheckActionItem,
  locale: AppLocale = DEFAULT_LOCALE
): string {
  return getLocalizedText(item.summary, locale);
}

export function shouldDisplayActionItem(item: QuickCheckActionItem, answers: QuickCheckAnswers): boolean {
  if (!item.showWhen || item.showWhen.length === 0) {
    return true;
  }

  return item.showWhen.every((condition) => {
    const answer = answers[condition.questionId];

    if (Array.isArray(answer)) {
      return answer.some((id) => condition.includesAny.includes(id));
    }

    return answer !== undefined && condition.includesAny.includes(answer);
  });
}
