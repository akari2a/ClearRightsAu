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
  pageTitle,
  pageDescription,
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
      <div className="cases-index__header">
        <h1 className="cases-index__title">{pageTitle}</h1>
        <p className="cases-index__description">{pageDescription}</p>
      </div>

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
