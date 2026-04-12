import type { QuickCheckAnswers } from "../../types/quickCheck";
import type { GuideResult } from "../../types/guide";
import type { AppLocale } from "../../i18n/config";
import { GuideCheckPageShell } from "./guide/GuideCheckPageShell";
import { refundScenarioConfig } from "./refund-check/refundScenarioConfig";

type RefundCheckPageProps = {
  locale?: AppLocale;
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, result: GuideResult | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

export function RefundCheckPage({ locale = "en", onQuestionnaireComplete, onSectionNavigate }: RefundCheckPageProps) {
  return (
    <GuideCheckPageShell
      locale={locale}
      config={refundScenarioConfig}
      onQuestionnaireComplete={onQuestionnaireComplete}
      onSectionNavigate={onSectionNavigate}
    />
  );
}
