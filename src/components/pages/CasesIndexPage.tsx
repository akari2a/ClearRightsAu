import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CaseIndexGroup, SuccessCase } from "../../types/case";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";

type CasesIndexPageProps = {
  pageTitle: string;
  pageDescription: string;
  groups: CaseIndexGroup[];
  cases: SuccessCase[];
  onCaseClick?: (caseData: SuccessCase) => void;
};

const BATCH_SIZE = 6;

export function CasesIndexPage({
  pageTitle,
  pageDescription,
  groups,
  cases,
  onCaseClick
}: CasesIndexPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colCount, setColCount] = useState<number>(3);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) setColCount(1);
      else if (window.innerWidth <= 980) setColCount(2);
      else setColCount(3);
    };
    handleResize(); // Init safely on client side
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group dictionaries for quick lookup
  const groupAccentMap = useMemo(() => {
    const map: Record<string, string> = {};
    groups.forEach((g) => {
      map[g.categoryKey] = g.accentColor ?? "#2563eb";
    });
    return map;
  }, [groups]);

  // Handle filter changes
  const handleFilterClick = (filterId: string) => {
    setSearchParams(filterId === "all" ? {} : { filter: filterId }, { replace: true });
    setVisibleCount(BATCH_SIZE);
  };

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [activeFilter]);

  // Filter cases based on active tab
  const filteredCases = useMemo(() => {
    if (activeFilter === "all") {
      return cases;
    }
    // Filter cases by the corresponding group
    const activeGroup = groups.find((g) => g.categoryKey === activeFilter);
    if (!activeGroup) return [];
    
    return activeGroup.caseIds
      .map((id) => cases.find((c) => c.id === id))
      .filter(Boolean) as SuccessCase[];
  }, [cases, groups, activeFilter]);

  const displayedCases = filteredCases.slice(0, visibleCount);
  const hasMoreCases = visibleCount < filteredCases.length;

  const masonryColumns = useMemo(() => {
    const cols: SuccessCase[][] = Array.from({ length: colCount }, () => []);
    displayedCases.forEach((item, index) => {
      cols[index % colCount].push(item);
    });
    return cols;
  }, [displayedCases, colCount]);

  // Set up intersection observer for infinite scrolling
  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreCases && !isLoading) {
        setIsLoading(true);
        // Simulate network delay for UX
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredCases.length));
          setIsLoading(false);
        }, 500);
      }
    },
    [hasMoreCases, isLoading, filteredCases.length]
  );

  useEffect(() => {
    const currentSentinel = loadingSentinelRef.current;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserve, {
      root: null,
      rootMargin: "0px 0px 400px 0px", // Trigger slightly before reaching the bottom
      threshold: 0
    });

    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserve]);

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
              const accentColor = groupAccentMap[caseItem.category] ?? "#2563eb";
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
                      <span className="showcase-card__eyebrow" style={{ color: accentColor }}>
                        {caseItem.categoryLabel}
                      </span>
                      <h3 className="showcase-card__title">{caseItem.title}</h3>
                      <p className="showcase-card__summary">{caseItem.summary}</p>
                    </div>
                    <div className="showcase-card__bottom">
                      <span className="showcase-card__meta">
                        {caseItem.persona.name} · {caseItem.riskLabel}
                      </span>
                      <span className="showcase-card__read" style={{ "--accent": accentColor } as React.CSSProperties}>
                        Read case
                      </span>
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
