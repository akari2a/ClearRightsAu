import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getHomePageContent } from "./content/homeContent";
import { SiteHeader, type HeaderPrimaryNavKey } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { ScamCheckPage } from "./components/pages/ScamCheckPage";
import { HeroSection } from "./components/sections/HeroSection";
import { ContentResourcesSection } from "./components/sections/ContentResourcesSection";
import { DEFAULT_LOCALE } from "./i18n/config";
import type { GuideTab, LinkCard, TabKey } from "./types/home";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const homePageContent = useMemo(() => getHomePageContent(DEFAULT_LOCALE), []);
  const [activeTab, setActiveTab] = useState<TabKey>("scam");
  const [fontSize, setFontSize] = useState<"small" | "default" | "large">("default");
  const selectedTab = useMemo(
    () => homePageContent.guideTabs.find((tab) => tab.key === activeTab) ?? homePageContent.guideTabs[0],
    [activeTab, homePageContent]
  );
  const [promptPlaceholder, setPromptPlaceholder] = useState(selectedTab.prompt);

  const handleTabChange = (tab: GuideTab) => {
    setActiveTab(tab.key);
    setPromptPlaceholder(tab.prompt);
  };

  const handlePopularHelpClick = (item: string, tab: GuideTab) => {
    console.info("Suggested chatbot prompt clicked", { item, tab: tab.key });
  };

  const handleOpenChatbot = (initialQuestion: string | undefined, tab: GuideTab) => {
    console.info("Open chatbot clicked", { initialQuestion, tab: tab.key });
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
                  brandName={homePageContent.siteCopy.brandName}
                  slogan={homePageContent.siteCopy.slogan}
                  guideDescription={homePageContent.siteCopy.quickCheckDescription}
                  chatbotTitle={homePageContent.siteCopy.chatbotTitle}
                  tabs={homePageContent.guideTabs}
                  commonQuestions={homePageContent.commonQuestions}
                  activeTabKey={activeTab}
                  promptPlaceholder={promptPlaceholder}
                  onTabChange={handleTabChange}
                  onCommonQuestionClick={handlePopularHelpClick}
                  onQuickGuideClick={handleQuickGuideClick}
                  onOpenChatbot={handleOpenChatbot}
                />

                <ContentResourcesSection
                  eyebrow={homePageContent.resources.eyebrow}
                  title={homePageContent.resources.title}
                  caseGroupTitle={homePageContent.resources.caseGroup.title}
                  caseGroupDescription={homePageContent.resources.caseGroup.description}
                  guideGroupTitle={homePageContent.resources.guideGroup.title}
                  guideGroupDescription={homePageContent.resources.guideGroup.description}
                  caseCards={homePageContent.resources.caseCards}
                  guideCards={homePageContent.resources.guideCards}
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
