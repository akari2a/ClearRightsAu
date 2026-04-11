import { CaseCategoryTag } from "../case/CaseCategoryTag";
import type { CaseIndexGroup, SuccessCase } from "../../types/case";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";
import { useCasesIndexState } from "./cases/useCasesIndexState";

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
  const {
    activeFilter,
    hasMoreCases,
    isLoading,
    loadingSentinelRef,
    masonryColumns,
    handleFilterClick
  } = useCasesIndexState(groups, cases);

  return (
    <section className="cases-index">
      <div className="cases-index__header">
        <h1 className="cases-index__title">{pageTitle}</h1>
        <p className="cases-index__description">{pageDescription}</p>
        
        <div className="filter-chips-container" role="tablist" aria-label="Filter cases">
          <button
            role="tab"
            aria-selected={activeFilter === "all"}
            className={`filter-chip ${activeFilter === "all" ? "filter-chip--active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All
          </button>
          
          {groups.map((group) => (
            <button
              key={group.categoryKey}
              role="tab"
              aria-selected={activeFilter === group.categoryKey}
              className={`filter-chip ${activeFilter === group.categoryKey ? "filter-chip--active" : ""}`}
              onClick={() => handleFilterClick(group.categoryKey)}
            >
              {group.categoryLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="cases-masonry-container">
        {masonryColumns.map((col, colIndex) => (
          <div key={`col-${colIndex}`} className="cases-masonry-column">
            {col.map((caseItem) => {
              return (
                <InteractiveCardButton
                  key={caseItem.id}
                  className="showcase-card showcase-card--masonry"
                  onClick={() => onCaseClick?.(caseItem)}
                >
                  {caseItem.cardImage ? (
                    <div className="showcase-card__media">
                      <img
                        className="showcase-card__bg"
                        src={caseItem.cardImage}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                    <div className="showcase-card__body">
                      <div className="showcase-card__top">
                      <CaseCategoryTag category={caseItem.category} label={caseItem.categoryLabel} className="showcase-card__eyebrow" />
                      <h3 className="showcase-card__title">{caseItem.title}</h3>
                      <p className="showcase-card__summary">{caseItem.summary}</p>
                    </div>
                  </div>
                </InteractiveCardButton>
              );
            })}
          </div>
        ))}
      </div>

      {hasMoreCases && (
        <div ref={loadingSentinelRef} className="cases-loading-sentinel" aria-hidden="true">
          {isLoading && <span className="cases-loading-spinner" />}
        </div>
      )}
    </section>
  );
}
