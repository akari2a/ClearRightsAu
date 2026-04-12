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

export const SCAM_QUESTIONNAIRE = questionsJson as unknown as QuickCheckQuestionFile;
export const SCAM_STAGES = stagesJson as unknown as QuickCheckStageFile;
export const SCAM_ACTION_PACKS = actionPacksJson as unknown as QuickCheckActionPackFile;

export function getLocalizedText(text: QuickCheckLocalizedText, locale: AppLocale = DEFAULT_LOCALE): string {
  return text[locale] ?? text[DEFAULT_LOCALE] ?? Object.values(text)[0] ?? "";
}

export function resolveMatchingStages(answers: QuickCheckAnswers): QuickCheckStage[] {
  return SCAM_STAGES.stages.filter((stage) =>
    Object.entries(stage.affectedBy).every(([questionId, optionIds]) => {
      const answer = answers[questionId];
      if (Array.isArray(answer)) {
        return answer.some((selectedOptionId) => optionIds.includes(selectedOptionId));
      }

      return answer !== undefined && optionIds.includes(answer);
    })
  );
}

function answerMatchesOptionIds(answer: QuickCheckAnswers[string] | undefined, optionIds: string[]) {
  if (Array.isArray(answer)) {
    return answer.some((selectedOptionId) => optionIds.includes(selectedOptionId));
  }

  return answer !== undefined && optionIds.includes(answer);
}

export function resolveHighestPriorityStage(answers: QuickCheckAnswers): QuickCheckStage | null {
  const matches = resolveMatchingStages(answers);

  if (matches.length === 0) {
    return null;
  }

  return matches.reduce((highest, stage) => (stage.priority > highest.priority ? stage : highest));
}

export function getActionPackForStage(stageId: string): QuickCheckActionPack | null {
  return SCAM_ACTION_PACKS.actionPacks.find((pack) => pack.stageId === stageId) ?? null;
}

export function hasUsableActionPackContent(pack: QuickCheckActionPack): boolean {
  return pack.steps.some((item) => {
    if (item.content.type === "plain_text") {
      return Object.values(item.content.text).some((value) => value.trim().length > 0);
    }

    if (Object.values(item.content.template).some((value) => value.trim().length > 0)) {
      return true;
    }

    return Object.values(item.content.arguments).some(
      (argument) =>
        Object.values(argument.default).some((value) => value.trim().length > 0) ||
        Object.values(argument.map).some((value) => Object.values(value).some((nestedValue) => nestedValue.trim().length > 0))
    );
  });
}

export function createFallbackActionPack(stage: QuickCheckStage): QuickCheckActionPack {
  return {
    stageId: stage.id,
    resultTitle: stage.label,
    resultSummary: { en: "" },
    steps: [
      {
        id: "pending_guidance",
        kind: "step",
        summary: { en: "Detailed guidance" },
        content: {
          type: "plain_text",
          text: { en: "Detailed guidance for this stage will be added next." }
        }
      }
    ]
  };
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

  return item.showWhen.every((condition) => answerMatchesOptionIds(answers[condition.questionId], condition.includesAny));
}

function resolveFormatText(content: QuickCheckFormatTextContent, answers: QuickCheckAnswers, locale: AppLocale): string {
  let output = getLocalizedText(content.template, locale);

  Object.entries(content.arguments).forEach(([token, config]) => {
    const answer = answers[config.fromQuestion];
    const selectedAnswer = Array.isArray(answer) ? answer[0] : answer;
    const replacement = getLocalizedText((selectedAnswer && config.map[selectedAnswer]) || config.default, locale);
    output = output.split(`{${token}}`).join(replacement);
  });

  return output;
}
