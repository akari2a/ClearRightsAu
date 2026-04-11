import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { getHomePageContent } from "./content/homeContent";
import { getCaseById, getCasesPageContent } from "./content/casesContent";
import { SiteHeader, type HeaderPrimaryNavKey } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteBreadcrumbs, type BreadcrumbItem } from "./components/layout/SiteBreadcrumbs";
import { ScamCheckPage } from "./components/pages/ScamCheckPage";
import { CasesIndexPage } from "./components/pages/CasesIndexPage";
import { CaseDetailPage } from "./components/pages/CaseDetailPage";
import { HeroSection } from "./components/sections/HeroSection";
import { ContentResourcesSection } from "./components/sections/ContentResourcesSection";
import { DEFAULT_LOCALE } from "./i18n/config";
import type { GuideTab, LinkCard, TabKey } from "./types/home";
import type { SuccessCase } from "./types/case";
import type { QuickCheckAnswers, QuickCheckStage } from "./types/quickCheck";

function CaseDetailRoute({
  onRelatedGuideClick,
  onRelatedCaseClick
}: {
  onRelatedGuideClick: (route: string) => void;
  onRelatedCaseClick: (caseData: SuccessCase) => void;
}) {
  const { caseId } = useParams<{ caseId: string }>();
  const casesContent = useMemo(() => getCasesPageContent(DEFAULT_LOCALE), []);
  const caseData = caseId ? getCaseById(casesContent, caseId) : undefined;

  const relatedCases = useMemo(() => {
    if (!caseData) return [];
    return caseData.relatedCaseIds
      .map((id) => getCaseById(casesContent, id))
      .filter(Boolean) as SuccessCase[];
  }, [caseData, casesContent]);

  if (!caseData) {
    return <Navigate to="/cases" replace />;
  }

  return (
    <CaseDetailPage
      caseData={caseData}
      sections={casesContent.sections}
      relatedCases={relatedCases}
      onRelatedGuideClick={onRelatedGuideClick}
      onRelatedCaseClick={onRelatedCaseClick}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const homePageContent = useMemo(() => getHomePageContent(DEFAULT_LOCALE), []);
  const casesPageContent = useMemo(() => getCasesPageContent(DEFAULT_LOCALE), []);
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (location.pathname === "/cases") {
      return [];
    }

    if (location.pathname.startsWith("/cases/")) {
      const caseId = location.pathname.replace("/cases/", "");
      const caseData = getCaseById(casesPageContent, caseId);

      return [
        { label: "Cases", to: "/cases" },
        { label: caseData?.title ?? "Case details" }
      ];
    }

    return [];
  }, [location.pathname, casesPageContent]);
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

    if (destination === "guide") {
      navigate("/scam-check");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (destination === "cases") {
      navigate("/cases");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.info("Navigation clicked", { destination });
  };

  const SECONDARY_NAV_CATEGORY_MAP: Record<string, string> = {
    "c-scam": "scam",
    "c-products": "refund",
    "c-tenancy": "tenancy"
  };

  const handleSecondaryNavigate = (destination: string) => {
    const categoryId = SECONDARY_NAV_CATEGORY_MAP[destination];
    if (categoryId) {
      navigate(`/cases?filter=${categoryId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.info("Secondary navigation clicked", { destination });
  };

  const handleLanguageSelect = () => {
    console.info("Language selector clicked");
  };

  const HOMEPAGE_CASE_ROUTE_MAP: Record<string, string> = {
    "I clicked a delivery text link but did not enter my details": "/cases/zhang-san-scam",
    "The shop refused a refund for a faulty appliance": "/cases/ching-refund",
    "My landlord deducted bond money for cleaning": "/cases/simon-wang-bond"
  };

  const handleCaseClick = (card: LinkCard) => {
    const route = HOMEPAGE_CASE_ROUTE_MAP[card.title];
    if (route) {
      navigate(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    console.info("Case card clicked", { title: card.title });
  };

  const handleCasesIndexCaseClick = (caseData: SuccessCase) => {
    navigate(`/cases/${caseData.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCaseRelatedGuideClick = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScamQuestionnaireComplete = (answers: QuickCheckAnswers, stage: QuickCheckStage | null) => {
    console.info("Scam questionnaire completed", { answers, stage: stage?.id ?? null });
  };

  const handleScamSectionNavigate = (sectionId: string) => {
    console.info("Scam section navigated", { sectionId });
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

  const activePrimaryNav: HeaderPrimaryNavKey = location.pathname === "/scam-check"
    ? "guide"
    : location.pathname.startsWith("/cases")
      ? "cases"
      : "home";

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

        {location.pathname !== "/" && breadcrumbItems.length > 0 ? <SiteBreadcrumbs items={breadcrumbItems} /> : null}

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
                  caseCards={homePageContent.resources.caseCards}
                  onCaseClick={handleCaseClick}
                />
              </>
            }
          />
          <Route
            path="/scam-check"
            element={
              <ScamCheckPage
                onQuestionnaireComplete={handleScamQuestionnaireComplete}
                onSectionNavigate={handleScamSectionNavigate}
              />
            }
          />
          <Route
            path="/cases"
            element={
              <CasesIndexPage
                pageTitle={casesPageContent.pageTitle}
                pageDescription={casesPageContent.pageDescription}
                groups={casesPageContent.groups}
                cases={casesPageContent.cases}
                onCaseClick={handleCasesIndexCaseClick}
              />
            }
          />
          <Route
            path="/cases/:caseId"
            element={
              <CaseDetailRoute
                onRelatedGuideClick={handleCaseRelatedGuideClick}
                onRelatedCaseClick={handleCasesIndexCaseClick}
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
