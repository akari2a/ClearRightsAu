import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CaseIndexGroup, SuccessCase } from "../../../types/case";

const DEFAULT_BATCH_SIZE = 6;

function getColumnCount(width: number) {
  if (width <= 600) return 1;
  if (width <= 980) return 2;
  return 3;
}

export function useCasesIndexState(groups: CaseIndexGroup[], cases: SuccessCase[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";
  const searchQuery = searchParams.get("q") || "";
  const [visibleCount, setVisibleCount] = useState<number>(DEFAULT_BATCH_SIZE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<number>(3);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredCases = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const baseCases =
      activeFilter === "all"
        ? cases
        : (() => {
            const activeGroup = groups.find((group) => group.categoryKey === activeFilter);

            if (!activeGroup) {
              return [];
            }

            return activeGroup.caseIds
              .map((id) => cases.find((caseItem) => caseItem.id === id))
              .filter(Boolean) as SuccessCase[];
          })();

    if (!normalizedQuery) {
      return baseCases;
    }

    return baseCases.filter((caseItem) => {
      const searchableText = [
        caseItem.title,
        caseItem.summary,
        caseItem.categoryLabel,
        caseItem.persona.name,
        caseItem.persona.background,
        caseItem.outcome.headline
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeFilter, cases, groups, searchQuery]);

  const displayedCases = filteredCases.slice(0, visibleCount);
  const hasMoreCases = visibleCount < filteredCases.length;

  const masonryColumns = useMemo(() => {
    const columns: SuccessCase[][] = Array.from({ length: columnCount }, () => []);

    displayedCases.forEach((item, index) => {
      columns[index % columnCount].push(item);
    });

    return columns;
  }, [columnCount, displayedCases]);

  const handleFilterClick = (filterId: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (filterId === "all") {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", filterId);
    }

    setSearchParams(nextParams, { replace: true });
    setVisibleCount(DEFAULT_BATCH_SIZE);
  };

  const handleSearchChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      nextParams.delete("q");
    } else {
      nextParams.set("q", value);
    }

    setSearchParams(nextParams, { replace: true });
    setVisibleCount(DEFAULT_BATCH_SIZE);
  };

  useEffect(() => {
    setVisibleCount(DEFAULT_BATCH_SIZE);
  }, [activeFilter, searchQuery]);

  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasMoreCases && !isLoading) {
        setIsLoading(true);
        window.setTimeout(() => {
          setVisibleCount((previousCount) => Math.min(previousCount + DEFAULT_BATCH_SIZE, filteredCases.length));
          setIsLoading(false);
        }, 500);
      }
    },
    [filteredCases.length, hasMoreCases, isLoading]
  );

  useEffect(() => {
    const currentSentinel = loadingSentinelRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserve, {
      root: null,
      rootMargin: "0px 0px 400px 0px",
      threshold: 0
    });

    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleObserve]);

  return {
    activeFilter,
    searchQuery,
    hasMoreCases,
    isLoading,
    loadingSentinelRef,
    masonryColumns,
    handleFilterClick,
    handleSearchChange
  };
}
