import type { CaseIndexGroup, SuccessCase } from "../../types/case";
import { CaseShowcaseSection } from "../sections/CaseShowcaseSection";

type CasesIndexPageProps = {
  pageTitle: string;
  pageDescription: string;
  groups: CaseIndexGroup[];
  cases: SuccessCase[];
  onCaseClick?: (caseData: SuccessCase) => void;
};

export function CasesIndexPage({
  groups,
  cases,
  onCaseClick
}: CasesIndexPageProps) {
  const getCasesForGroup = (group: CaseIndexGroup): SuccessCase[] =>
    group.caseIds
      .map((id) => cases.find((c) => c.id === id))
      .filter(Boolean) as SuccessCase[];

  return (
    <section className="cases-index">
      {/* Header removed based on user request */}

      <div className="cases-index__groups">
        {groups.map((group) => {
          const groupCases = getCasesForGroup(group);
          if (groupCases.length === 0) return null;

          return (
            <CaseShowcaseSection
              key={group.categoryKey}
              group={group}
              cases={groupCases}
              onCaseClick={onCaseClick}
            />
          );
        })}
      </div>
    </section>
  );
}
