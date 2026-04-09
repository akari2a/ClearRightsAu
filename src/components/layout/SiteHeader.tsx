import { useEffect, useMemo, useRef, useState } from "react";
import { HeaderDropdownNavItem } from "./header/HeaderDropdownNavItem";
import { HeaderFontSizeControl } from "./header/HeaderFontSizeControl";
import { HeaderLanguageButton } from "./header/HeaderLanguageButton";
import { HeaderNavButton } from "./header/HeaderNavButton";

export type HeaderPrimaryNavKey = "home" | "questions" | "cases" | "guides" | "aibot" | "about";

type SecondaryNavItem = {
  id: string;
  label: string;
};

const SECONDARY_NAV: Record<"questions" | "cases" | "guides", SecondaryNavItem[]> = {
  questions: [
    { id: "q-scam", label: "Scam questions" },
    { id: "q-refund", label: "Refund questions" },
    { id: "q-rental", label: "Rental bond questions" }
  ],
  cases: [
    { id: "c-scam", label: "Scam cases" },
    { id: "c-products", label: "Product cases" },
    { id: "c-tenancy", label: "Tenancy cases" }
  ],
  guides: [
    { id: "g-risk", label: "Risk checks" },
    { id: "g-evidence", label: "Evidence guides" },
    { id: "g-escalation", label: "Escalation steps" }
  ]
};

const SECONDARY_NAV_LABELS: Record<"questions" | "cases" | "guides", string> = {
  questions: "Questions",
  cases: "Cases",
  guides: "Guides"
};

type SiteHeaderProps = {
  activePrimaryNav: HeaderPrimaryNavKey;
  activeFontSize: "small" | "default" | "large";
  onNavigate?: (destination: HeaderPrimaryNavKey) => void;
  onSecondaryNavigate?: (destination: string) => void;
  onFontSizeChange?: (size: "small" | "default" | "large") => void;
  onLanguageSelect?: () => void;
};

export function SiteHeader({
  activePrimaryNav,
  activeFontSize,
  onNavigate,
  onSecondaryNavigate,
  onFontSizeChange,
  onLanguageSelect
}: SiteHeaderProps) {
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<"questions" | "cases" | "guides" | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPastTop, setIsPastTop] = useState(false);
  const lastScrollYRef = useRef(0);
  const hoveredSecondaryNavItems = useMemo(
    () => (hoveredPrimaryNav ? SECONDARY_NAV[hoveredPrimaryNav] : null),
    [hoveredPrimaryNav]
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollYRef.current = currentScrollY;

      setIsPastTop(currentScrollY > 12);

      if (currentScrollY <= 12) {
        setIsHeaderVisible(true);
      } else if (Math.abs(scrollDelta) < 4) {
        return;
      } else if (scrollDelta > 0) {
        setIsHeaderVisible(false);
        setHoveredPrimaryNav(null);
      } else {
        setIsHeaderVisible(true);
      }
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`site-header${isHeaderVisible ? " site-header--visible" : " site-header--hidden"}${
        isHeaderVisible && isPastTop ? " site-header--revealed" : ""
      }`}
      onMouseLeave={() => setHoveredPrimaryNav(null)}
    >
      <div className="topbar">
        <nav className="nav-menu" aria-label="Primary">
          <HeaderNavButton
            label="Home"
            isActive={activePrimaryNav === "home"}
            onMouseEnter={() => setHoveredPrimaryNav(null)}
            onFocus={() => setHoveredPrimaryNav(null)}
            onClick={() => onNavigate?.("home")}
          />
          <HeaderDropdownNavItem
            label="Questions"
            isActive={activePrimaryNav === "questions"}
            isOpen={hoveredPrimaryNav === "questions"}
            panelLabel={SECONDARY_NAV_LABELS.questions}
            items={SECONDARY_NAV.questions}
            onOpen={() => setHoveredPrimaryNav("questions")}
            onPrimaryClick={() => onNavigate?.("questions")}
            onSecondaryClick={onSecondaryNavigate}
          />
          <HeaderDropdownNavItem
            label="Cases"
            isActive={activePrimaryNav === "cases"}
            isOpen={hoveredPrimaryNav === "cases"}
            panelLabel={SECONDARY_NAV_LABELS.cases}
            items={SECONDARY_NAV.cases}
            onOpen={() => setHoveredPrimaryNav("cases")}
            onPrimaryClick={() => onNavigate?.("cases")}
            onSecondaryClick={onSecondaryNavigate}
          />
          <HeaderDropdownNavItem
            label="Guides"
            isActive={activePrimaryNav === "guides"}
            isOpen={hoveredPrimaryNav === "guides"}
            panelLabel={SECONDARY_NAV_LABELS.guides}
            items={SECONDARY_NAV.guides}
            onOpen={() => setHoveredPrimaryNav("guides")}
            onPrimaryClick={() => onNavigate?.("guides")}
            onSecondaryClick={onSecondaryNavigate}
          />
          <HeaderNavButton
            label="AIBot"
            isActive={activePrimaryNav === "aibot"}
            onMouseEnter={() => setHoveredPrimaryNav(null)}
            onFocus={() => setHoveredPrimaryNav(null)}
            onClick={() => onNavigate?.("aibot")}
            children={
              <span className="nav-item__aibot">
                <span>AIBot</span>
              </span>
            }
          />
          <HeaderNavButton
            label="About"
            isActive={activePrimaryNav === "about"}
            onMouseEnter={() => setHoveredPrimaryNav(null)}
            onFocus={() => setHoveredPrimaryNav(null)}
            onClick={() => onNavigate?.("about")}
          />
        </nav>

        <div className="header-utilities">
          <HeaderFontSizeControl activeFontSize={activeFontSize} onFontSizeChange={onFontSizeChange} />
          <HeaderLanguageButton onClick={onLanguageSelect} />
        </div>
      </div>
    </header>
  );
}
