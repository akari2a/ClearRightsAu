import type { QuickCheckAnswers } from "../../types/quickCheck";
import type { GuideResult } from "../../types/guide";
import { GuideCheckPageShell } from "./guide/GuideCheckPageShell";
import { refundScenarioConfig } from "./refund-check/refundScenarioConfig";

type RefundCheckPageProps = {
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, result: GuideResult | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

export function RefundCheckPage({ onQuestionnaireComplete, onSectionNavigate }: RefundCheckPageProps) {
  return (
    <GuideCheckPageShell
      config={refundScenarioConfig}
      onQuestionnaireComplete={onQuestionnaireComplete}
      onSectionNavigate={onSectionNavigate}
    />
  );
}
