import type { QuickCheckAnswers } from "../../types/quickCheck";
import type { GuideResult } from "../../types/guide";
import { GuideCheckPageShell } from "./guide/GuideCheckPageShell";
import { unsafeProductsScenarioConfig } from "./unsafe-products-check/unsafeProductsScenarioConfig";

type UnsafeProductsCheckPageProps = {
  onQuestionnaireComplete?: (answers: QuickCheckAnswers, result: GuideResult | null) => void;
  onSectionNavigate?: (sectionId: string) => void;
};

export function UnsafeProductsCheckPage({ onQuestionnaireComplete, onSectionNavigate }: UnsafeProductsCheckPageProps) {
  return (
    <GuideCheckPageShell
      config={unsafeProductsScenarioConfig}
      onQuestionnaireComplete={onQuestionnaireComplete}
      onSectionNavigate={onSectionNavigate}
    />
  );
}
