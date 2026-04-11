import { useEffect, useRef, useState } from "react";
import { HeaderDropdownNavItem } from "./header/HeaderDropdownNavItem";
import { HeaderFontSizeControl } from "./header/HeaderFontSizeControl";
import { HeaderLanguageButton } from "./header/HeaderLanguageButton";
import { HeaderNavButton } from "./header/HeaderNavButton";

export type HeaderPrimaryNavKey = "home" | "guide" | "cases" | "aibot" | "about";

type SecondaryNavItem = {
  id: string;
  label: string;
};

const SECONDARY_NAV: Record<"guide", SecondaryNavItem[]> = {
  guide: [
    { id: "g-risk", label: "Risk checks" },
    { id: "g-evidence", label: "Evidence guides" },
    { id: "g-escalation", label: "Escalation steps" }
  ]
};

const SECONDARY_NAV_LABELS: Record<"guide", string> = {
  guide: "Guide"
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
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<"guide" | "cases" | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPastTop, setIsPastTop] = useState(false);
  const lastScrollYRef = useRef(0);

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
            label="Guide"
            isActive={activePrimaryNav === "guide"}
            isOpen={hoveredPrimaryNav === "guide"}
            panelLabel={SECONDARY_NAV_LABELS.guide}
            items={SECONDARY_NAV.guide}
            onOpen={() => setHoveredPrimaryNav("guide")}
            onPrimaryClick={() => onNavigate?.("guide")}
            onSecondaryClick={onSecondaryNavigate}
          />
          <HeaderNavButton
            label="Cases"
            isActive={activePrimaryNav === "cases"}
            onMouseEnter={() => setHoveredPrimaryNav(null)}
            onFocus={() => setHoveredPrimaryNav(null)}
            onClick={() => onNavigate?.("cases")}
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
