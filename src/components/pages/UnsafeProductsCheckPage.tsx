import type { QuickCheckAnswers } from "../../types/quickCheck";
import type { GuideResult } from "../../types/guide";
import type { AppLocale } from "../../i18n/config";
import { GuideCheckPageShell } from "./guide/GuideCheckPageShell";
import { unsafeProductsScenarioConfig } from "./unsafe-products-check/unsafeProductsScenarioConfig";

type UnsafeProductsCheckPageProps = {
  locale?: AppLocale;
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, result: GuideResult | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

export function UnsafeProductsCheckPage({
  locale = "en",
  onQuestionnaireComplete,
  onSectionNavigate
}: UnsafeProductsCheckPageProps) {
  return (
    <GuideCheckPageShell
      locale={locale}
      config={unsafeProductsScenarioConfig}
      onQuestionnaireComplete={onQuestionnaireComplete}
      onSectionNavigate={onSectionNavigate}
    />
  );
}
