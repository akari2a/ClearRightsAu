import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { getHomePageContent } from "./content/homeContent";
import { getCaseById, getCasesPageContent } from "./content/casesContent";
import { getAibotPageContent } from "./content/aibotContent";
import { SiteHeader, type HeaderPrimaryNavKey } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteBreadcrumbs, type BreadcrumbItem } from "./components/layout/SiteBreadcrumbs";
import { ScamCheckPage } from "./components/pages/ScamCheckPage";
import { RefundCheckPage } from "./components/pages/RefundCheckPage";
import { UnsafeProductsCheckPage } from "./components/pages/UnsafeProductsCheckPage";
import { CasesIndexPage } from "./components/pages/CasesIndexPage";
import { CaseDetailPage } from "./components/pages/CaseDetailPage";
import { AibotPage } from "./components/pages/AibotPage";
import { HeroSection } from "./components/sections/HeroSection";
import { ContentResourcesSection } from "./components/sections/ContentResourcesSection";
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "./i18n/config";
import { getUiCopy } from "./i18n/copy";
import type { GuideTab, LinkCard, TabKey } from "./types/home";
import type { SuccessCase } from "./types/case";
import type { QuickCheckAnswers, QuickCheckStage } from "./types/quickCheck";
import type { GuideResult } from "./types/guide";

const LOCALE_DISMISS_KEY = "locale-suggestion-dismissed";
const LOCALE_USER_SET_KEY = "app-locale-user-set";

function devicePrefersSimplifiedChinese(): boolean {
  if (typeof navigator === "undefined") return false;
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  return candidates.some((value) => value.toLowerCase().startsWith("zh"));
}

function CaseDetailRoute({
  locale,
  onRelatedGuideClick,
  onRelatedCaseClick
}: {
  locale: AppLocale;
  onRelatedGuideClick: (route: string) => void;
  onRelatedCaseClick: (caseData: SuccessCase) => void;
}) {
  const { caseId } = useParams<{ caseId: string }>();
  const casesContent = useMemo(() => getCasesPageContent(locale), [locale]);
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
      locale={locale}
      caseData={caseData}
      sections={casesContent.sections}
      relatedCases={relatedCases}
      onRelatedGuideClick={onRelatedGuideClick}
      onRelatedCaseClick={onRelatedCaseClick}
    />
  );
}

const FONT_SCALE_MAP = {
  small: 0.92,
  default: 1,
  large: 1.12
} as const;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLanguage, setActiveLanguage] = useState<AppLocale>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    const stored = window.localStorage.getItem("app-locale");
    return stored && isAppLocale(stored) ? stored : DEFAULT_LOCALE;
  });
  const [showLocaleSuggestion, setShowLocaleSuggestion] = useState(false);
  const uiCopy = useMemo(() => getUiCopy(activeLanguage), [activeLanguage]);
  const zhUiCopy = useMemo(() => getUiCopy("zh-Hans"), []);
  const homePageContent = useMemo(() => getHomePageContent(activeLanguage), [activeLanguage]);
  const casesPageContent = useMemo(() => getCasesPageContent(activeLanguage), [activeLanguage]);
  const aibotPageContent = useMemo(() => getAibotPageContent(activeLanguage), [activeLanguage]);
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (location.pathname === "/cases") {
      return [];
    }

    if (location.pathname.startsWith("/cases/")) {
      const caseId = location.pathname.replace("/cases/", "");
      const caseData = getCaseById(casesPageContent, caseId);

      return [
        { label: uiCopy.breadcrumbs.cases, to: "/cases" },
        { label: caseData?.title ?? uiCopy.breadcrumbs.caseDetails }
      ];
    }

    return [];
  }, [location.pathname, casesPageContent, uiCopy.breadcrumbs.cases, uiCopy.breadcrumbs.caseDetails]);
  const [activeTab, setActiveTab] = useState<TabKey>("scam");
  const [fontSize, setFontSize] = useState<"small" | "default" | "large">("default");
  const [aibotInitialQuestion, setAibotInitialQuestion] = useState<string | undefined>();
  const [initialScamType, setInitialScamType] = useState<string | undefined>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("scam-type") ?? undefined;
  });
  const selectedTab = useMemo(
    () => homePageContent.guideTabs.find((tab) => tab.key === activeTab) ?? homePageContent.guideTabs[0],
    [activeTab, homePageContent]
  );
  const [promptPlaceholder, setPromptPlaceholder] = useState(selectedTab.prompt);

  const handleTabChange = (tab: GuideTab) => {
    setActiveTab(tab.key);
    setPromptPlaceholder(tab.prompt);
  };

  const handlePopularHelpClick = (item: string, _tab: GuideTab) => {
    setAibotInitialQuestion(item);
    navigate("/aibot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenChatbot = (initialQuestion: string | undefined, _tab: GuideTab) => {
    setAibotInitialQuestion(initialQuestion);
    navigate("/aibot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickGuideClick = (tab: GuideTab) => {
    if (tab.key === "scam") {
      navigate("/scam-check");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (tab.key === "refund") {
      navigate("/refund-check");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (tab.key === "unsafe") {
      navigate("/unsafe-products-check");
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
      const guidePaths = ["/scam-check", "/refund-check", "/unsafe-products-check"];
      if (guidePaths.includes(window.location.pathname)) {
        window.location.assign(window.location.pathname);
        return;
      }

      navigate("/scam-check");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (destination === "cases") {
      navigate("/cases");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (destination === "aibot") {
      setAibotInitialQuestion(undefined);
      navigate("/aibot");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

  };

  const SECONDARY_NAV_GUIDE_ROUTE_MAP: Record<string, string> = {
    "g-scam": "/scam-check",
    "g-refund": "/refund-check",
    "g-unsafe": "/unsafe-products-check"
  };

  const handleSecondaryNavigate = (destination: string) => {
    const route = SECONDARY_NAV_GUIDE_ROUTE_MAP[destination];

    if (route) {
      navigate(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.info("Secondary navigation clicked", { destination });
  };

  const handleLanguageSelect = (languageId: string) => {
    if (isAppLocale(languageId)) {
      setActiveLanguage(languageId);
      window.localStorage.setItem(LOCALE_USER_SET_KEY, "true");
      window.localStorage.setItem(LOCALE_DISMISS_KEY, "true");
      setShowLocaleSuggestion(false);
    }
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

  const handleRefundQuestionnaireComplete = (answers: QuickCheckAnswers, result: GuideResult | null) => {
    console.info("Refund questionnaire completed", { answers, resultId: result?.primaryResultId ?? null });
  };

  const handleRefundSectionNavigate = (sectionId: string) => {
    console.info("Refund section navigated", { sectionId });
  };

  const handleUnsafeProductsQuestionnaireComplete = (answers: QuickCheckAnswers, result: GuideResult | null) => {
    console.info("Unsafe products questionnaire completed", { answers, resultId: result?.primaryResultId ?? null });
  };

  const handleUnsafeProductsSectionNavigate = (sectionId: string) => {
    console.info("Unsafe products section navigated", { sectionId });
  };

  const handleFontSizeChange = (size: "small" | "default" | "large") => {
    setFontSize(size);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale-factor", String(FONT_SCALE_MAP[fontSize]));
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem("app-locale", activeLanguage);
    document.documentElement.lang = activeLanguage === "zh-Hans" ? "zh-Hans" : "en";
  }, [activeLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasUserSetLocale = window.localStorage.getItem(LOCALE_USER_SET_KEY) === "true";
    const hasDismissedSuggestion = window.localStorage.getItem(LOCALE_DISMISS_KEY) === "true";
    const shouldSuggest =
      activeLanguage === "en" &&
      !hasUserSetLocale &&
      !hasDismissedSuggestion &&
      devicePrefersSimplifiedChinese();

    setShowLocaleSuggestion(shouldSuggest);
  }, [activeLanguage]);

  const activePrimaryNav: HeaderPrimaryNavKey = location.pathname === "/aibot"
    ? "aibot"
    : (location.pathname === "/scam-check" || location.pathname === "/refund-check" || location.pathname === "/unsafe-products-check")
      ? "guide"
      : location.pathname.startsWith("/cases")
        ? "cases"
        : "home";

  const isAibotPage = location.pathname === "/aibot";
  const localeSuggestionCopy = showLocaleSuggestion && activeLanguage === "en" ? zhUiCopy.nav : uiCopy.nav;

  return (
    <main className={`page-shell${isAibotPage ? " page-shell--aibot" : ""}`}>
      <div className={`page-frame${isAibotPage ? " page-frame--full" : ""}`}>
        <SiteHeader
          activePrimaryNav={activePrimaryNav}
          activeFontSize={fontSize}
          activeLanguage={activeLanguage}
          onNavigate={handleNavigate}
          onSecondaryNavigate={handleSecondaryNavigate}
          onFontSizeChange={handleFontSizeChange}
          onLanguageSelect={handleLanguageSelect}
        />

        {showLocaleSuggestion ? (
          <div className="locale-suggestion-banner" role="status" aria-live="polite">
            <div className="locale-suggestion-banner__content">
              <p className="locale-suggestion-banner__title">{localeSuggestionCopy.localeSuggestionTitle}</p>
              <p className="locale-suggestion-banner__body">{localeSuggestionCopy.localeSuggestionBody}</p>
            </div>
            <div className="locale-suggestion-banner__actions">
              <button
                type="button"
                className="locale-suggestion-banner__button locale-suggestion-banner__button--primary"
                onClick={() => handleLanguageSelect("zh-Hans")}
              >
                {localeSuggestionCopy.localeSuggestionSwitch}
              </button>
              <button
                type="button"
                className="locale-suggestion-banner__button locale-suggestion-banner__button--secondary"
                onClick={() => {
                  window.localStorage.setItem(LOCALE_DISMISS_KEY, "true");
                  setShowLocaleSuggestion(false);
                }}
              >
                {localeSuggestionCopy.localeSuggestionStay}
              </button>
            </div>
          </div>
        ) : null}

        {location.pathname !== "/" && breadcrumbItems.length > 0 ? <SiteBreadcrumbs items={breadcrumbItems} /> : null}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection
                  locale={activeLanguage}
                  localeLabels={{
                    quickGuideTopicsAria: uiCopy.nav.guide,
                    suggestedQuestionsAria: uiCopy.aibot.suggestedQuestionsAria,
                    chatbotInputAria: uiCopy.aibot.chatbotInputAria,
                    askAi: uiCopy.aibot.askAi
                  }}
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
                  onNavigateToGuide={(howHappened) => {
                    navigate(`/scam-check?how_happened=${howHappened}&step=1`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  initialScamType={initialScamType}
                  onScamTypeConsumed={() => {
                    setInitialScamType(undefined);
                    // Clean URL param without navigation
                    const url = new URL(window.location.href);
                    url.searchParams.delete("scam-type");
                    window.history.replaceState({}, "", url.pathname + url.search);
                  }}
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
                locale={activeLanguage}
                onQuestionnaireComplete={handleScamQuestionnaireComplete}
                onSectionNavigate={handleScamSectionNavigate}
              />
            }
          />
          <Route
            path="/refund-check"
            element={
              <RefundCheckPage
                locale={activeLanguage}
                onQuestionnaireComplete={handleRefundQuestionnaireComplete}
                onSectionNavigate={handleRefundSectionNavigate}
              />
            }
          />
          <Route
            path="/unsafe-products-check"
            element={
              <UnsafeProductsCheckPage
                locale={activeLanguage}
                onQuestionnaireComplete={handleUnsafeProductsQuestionnaireComplete}
                onSectionNavigate={handleUnsafeProductsSectionNavigate}
              />
            }
          />
          <Route
            path="/cases"
            element={
              <CasesIndexPage
                localeLabels={uiCopy.cases}
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
                locale={activeLanguage}
                onRelatedGuideClick={handleCaseRelatedGuideClick}
                onRelatedCaseClick={handleCasesIndexCaseClick}
              />
            }
          />
          <Route
            path="/aibot"
            element={
              <AibotPage
                content={aibotPageContent}
                uiLabels={{
                  chatbotInputAria: uiCopy.aibot.chatbotInputAria,
                  askAi: uiCopy.aibot.askAi,
                  newConversation: uiCopy.aibot.newConversation
                }}
                initialQuestion={aibotInitialQuestion}
                onFallbackNavigate={(route) => {
                  navigate(route);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {isAibotPage ? null : <SiteFooter locale={activeLanguage} />}
      </div>
    </main>
  );
}

export default App;
