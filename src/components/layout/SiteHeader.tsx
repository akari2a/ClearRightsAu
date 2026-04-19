import { useEffect, useRef, useState } from "react";
import { HeaderDropdownNavItem } from "./header/HeaderDropdownNavItem";
import { HeaderFontSizeControl } from "./header/HeaderFontSizeControl";
import { HeaderLanguageButton } from "./header/HeaderLanguageButton";
import { HeaderNavButton } from "./header/HeaderNavButton";
import { getUiCopy } from "../../i18n/copy";
import type { AppLocale } from "../../i18n/config";

export type HeaderPrimaryNavKey = "home" | "guide" | "cases" | "aibot";

type SecondaryNavItem = {
  id: string;
  label: string;
};

type LanguageOption = {
  id: string;
  label: string;
};

const SECONDARY_NAV: Record<"guide", SecondaryNavItem[]> = {
  guide: [
    { id: "g-scam", label: "Scam" },
    { id: "g-refund", label: "Refund and replacement" },
    { id: "g-unsafe", label: "Unsafe products" }
  ]
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "en", label: "English" },
  { id: "zh-Hans", label: "简体中文" }
];

type SiteHeaderProps = {
  activePrimaryNav: HeaderPrimaryNavKey;
  activeFontSize: "small" | "default" | "large";
  onNavigate?: (destination: HeaderPrimaryNavKey) => void;
  onSecondaryNavigate?: (destination: string) => void;
  onFontSizeChange?: (size: "small" | "default" | "large") => void;
  activeLanguage?: AppLocale;
  onLanguageSelect?: (languageId: string) => void;
};

export function SiteHeader({
  activePrimaryNav,
  activeFontSize,
  onNavigate,
  onSecondaryNavigate,
  onFontSizeChange,
  activeLanguage = "en",
  onLanguageSelect
}: SiteHeaderProps) {
  const uiCopy = getUiCopy(activeLanguage);
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<"guide" | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPastTop, setIsPastTop] = useState(false);
  const lastScrollYRef = useRef(0);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageCloseTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (languageCloseTimeoutRef.current !== null) {
        window.clearTimeout(languageCloseTimeoutRef.current);
      }
    };
  }, []);

  const openLanguageMenu = () => {
    if (languageCloseTimeoutRef.current !== null) {
      window.clearTimeout(languageCloseTimeoutRef.current);
      languageCloseTimeoutRef.current = null;
    }

    setIsLanguageOpen(true);
  };

  const closeLanguageMenu = () => {
    if (languageCloseTimeoutRef.current !== null) {
      window.clearTimeout(languageCloseTimeoutRef.current);
    }

    languageCloseTimeoutRef.current = window.setTimeout(() => {
      setIsLanguageOpen(false);
      languageCloseTimeoutRef.current = null;
    }, 120);
  };

  const activeLanguageLabel =
    LANGUAGE_OPTIONS.find((option) => option.id === activeLanguage)?.label ?? LANGUAGE_OPTIONS[0].label;

  const guideItems = SECONDARY_NAV.guide.map((item) => {
    if (item.id === "g-scam") return { ...item, label: uiCopy.nav.guideScam };
    if (item.id === "g-refund") return { ...item, label: uiCopy.nav.guideRefund };
    if (item.id === "g-unsafe") return { ...item, label: uiCopy.nav.guideUnsafe };
    return item;
  });

  return (
    <header
      className={`site-header${isHeaderVisible ? " site-header--visible" : " site-header--hidden"}${
        isHeaderVisible && isPastTop ? " site-header--revealed" : ""
      }`}
      onMouseLeave={() => setHoveredPrimaryNav(null)}
    >
      <div className="topbar">
        <div className={`nav-menu-scroll${hoveredPrimaryNav ? " nav-menu-scroll--dropdown-open" : ""}`}>
          <nav className="nav-menu" aria-label="Primary">
            <HeaderNavButton
              label={uiCopy.nav.home}
              isActive={activePrimaryNav === "home"}
              onMouseEnter={() => setHoveredPrimaryNav(null)}
              onFocus={() => setHoveredPrimaryNav(null)}
              onClick={() => onNavigate?.("home")}
            />
            <HeaderDropdownNavItem
              label={uiCopy.nav.guide}
              isActive={activePrimaryNav === "guide"}
              isOpen={hoveredPrimaryNav === "guide"}
              items={guideItems}
              onOpen={() => setHoveredPrimaryNav("guide")}
              onPrimaryClick={() => onNavigate?.("guide")}
              onSecondaryClick={onSecondaryNavigate}
            />
            <HeaderNavButton
              label={uiCopy.nav.cases}
              isActive={activePrimaryNav === "cases"}
              onMouseEnter={() => setHoveredPrimaryNav(null)}
              onFocus={() => setHoveredPrimaryNav(null)}
              onClick={() => onNavigate?.("cases")}
            />
            <HeaderNavButton
              label={uiCopy.nav.aibot}
              isActive={activePrimaryNav === "aibot"}
              onMouseEnter={() => setHoveredPrimaryNav(null)}
              onFocus={() => setHoveredPrimaryNav(null)}
              onClick={() => onNavigate?.("aibot")}
            />
          </nav>
        </div>

        <div className="header-utilities">
          <HeaderFontSizeControl activeFontSize={activeFontSize} onFontSizeChange={onFontSizeChange} />
          <div
            className="language-menu-anchor"
            ref={languageMenuRef}
            onMouseEnter={openLanguageMenu}
            onMouseLeave={closeLanguageMenu}
          >
            <HeaderLanguageButton
              label={activeLanguageLabel}
              isOpen={isLanguageOpen}
              onClick={() => setIsLanguageOpen((previousValue) => !previousValue)}
            />

            {isLanguageOpen ? (
              <div className="subnav-panel language-menu" role="menu" aria-label="Language options">
                <div className="subnav-panel__list">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={activeLanguage === option.id}
                      className={`language-menu__option${
                        activeLanguage === option.id ? " language-menu__option--active" : ""
                      }`}
                      onClick={() => {
                        onLanguageSelect?.(option.id);
                        setIsLanguageOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
