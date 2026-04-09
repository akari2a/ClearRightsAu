import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CASE_CARDS, GUIDE_CARDS, GUIDE_TABS, POPULAR_HELP, SITE_COPY } from "./content/homeContent";
import { SiteHeader, type HeaderPrimaryNavKey } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { ScamCheckPage } from "./components/pages/ScamCheckPage";
import { HeroSection } from "./components/sections/HeroSection";
import { PopularHelpSection } from "./components/sections/PopularHelpSection";
import { ContentResourcesSection } from "./components/sections/ContentResourcesSection";
import type { GuideTab, LinkCard, TabKey } from "./types/home";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("scam");
  const [fontSize, setFontSize] = useState<"small" | "default" | "large">("default");
  const [inputValue, setInputValue] = useState("");
  const selectedTab = useMemo(
    () => GUIDE_TABS.find((tab) => tab.key === activeTab) ?? GUIDE_TABS[0],
    [activeTab]
  );
  const [promptPlaceholder, setPromptPlaceholder] = useState(selectedTab.prompt);

  const handleTabChange = (tab: GuideTab) => {
    setActiveTab(tab.key);
    setPromptPlaceholder(tab.prompt);
  };

  const handleQuickPillClick = (pill: string) => {
    setPromptPlaceholder(`“${pill}”`);
  };

  const handlePopularHelpClick = (item: string) => {
    setPromptPlaceholder(`“${item}”`);
    setInputValue("");
  };

  const handleAskAiClick = (value: string, tab: GuideTab) => {
    console.info("Ask AI clicked", { value, tab: tab.key });
  };

  const handleQuickGuideClick = (tab: GuideTab) => {
    if (tab.key === "scam") {
      navigate("/scam-check");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.info("Quick guide clicked", { tab: tab.key });
  };

  const handleNavigate = (destination: HeaderPrimaryNavKey) => {
    if (destination === "home") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.info("Navigation clicked", { destination });
  };

  const handleSecondaryNavigate = (destination: string) => {
    console.info("Secondary navigation clicked", { destination });
  };

  const handleLanguageSelect = () => {
    console.info("Language selector clicked");
  };

  const handleCaseClick = (card: LinkCard) => {
    console.info("Case card clicked", { title: card.title });
  };

  const handleGuideClick = (card: LinkCard) => {
    console.info("Guide card clicked", { title: card.title });
  };

  const handleScamJourneyChange = (journey: { key: string }) => {
    console.info("Scam journey changed", { journey: journey.key });
  };

  const handleScamSectionNavigate = (section: { id: string }) => {
    console.info("Scam section navigated", { section: section.id });
  };

  const handleScamCaseClick = (title: string) => {
    console.info("Scam case clicked", { title });
  };

  const handleFontSizeChange = (size: "small" | "default" | "large") => {
    setFontSize(size);
  };

  const fontScaleMap = {
    small: 0.92,
    default: 1,
    large: 1.12
  } as const;

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale-factor", String(fontScaleMap[fontSize]));
  }, [fontSize]);

  const activePrimaryNav: HeaderPrimaryNavKey = location.pathname === "/" ? "home" : "home";

  return (
    <main className="page-shell">
      <div className="page-frame">
        <SiteHeader
          activePrimaryNav={activePrimaryNav}
          activeFontSize={fontSize}
          onNavigate={handleNavigate}
          onSecondaryNavigate={handleSecondaryNavigate}
          onFontSizeChange={handleFontSizeChange}
          onLanguageSelect={handleLanguageSelect}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection
                  brandName={SITE_COPY.brandName}
                  slogan={SITE_COPY.slogan}
                  guideDescription={SITE_COPY.quickCheckDescription}
                  tabs={GUIDE_TABS}
                  activeTabKey={activeTab}
                  promptPlaceholder={promptPlaceholder}
                  inputValue={inputValue}
                  onTabChange={handleTabChange}
                  onQuickPillClick={handleQuickPillClick}
                  onInputChange={setInputValue}
                  onQuickGuideClick={handleQuickGuideClick}
                  onAskAiClick={handleAskAiClick}
                />

                <PopularHelpSection items={POPULAR_HELP} onItemClick={handlePopularHelpClick} />

                <ContentResourcesSection
                  caseCards={CASE_CARDS}
                  guideCards={GUIDE_CARDS}
                  onCaseClick={handleCaseClick}
                  onGuideClick={handleGuideClick}
                />
              </>
            }
          />
          <Route
            path="/scam-check"
            element={
              <ScamCheckPage
                onJourneyChange={handleScamJourneyChange}
                onSectionNavigate={handleScamSectionNavigate}
                onCaseClick={handleScamCaseClick}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <SiteFooter />
      </div>
    </main>
  );
}

export default App;
