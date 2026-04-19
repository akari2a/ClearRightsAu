import { useEffect, useState } from "react";
import { ArrowCircleIcon, StarIcon, SuspiciousTextIcon } from "../icons";
import { ScamRecogniserDialog } from "./ScamRecogniserDialog";
import type { GuideTab, TabKey } from "../../types/home";
import type { AppLocale } from "../../i18n/config";

type HeroSectionProps = {
  locale: AppLocale;
  localeLabels?: {
    quickGuideTopicsAria: string;
    suggestedQuestionsAria: string;
    chatbotInputAria: string;
    askAi: string;
  };
  brandName: string;
  slogan: string;
  guideDescription: string;
  chatbotTitle: string;
  tabs: GuideTab[];
  commonQuestions: string[];
  activeTabKey: TabKey;
  promptPlaceholder: string;
  onTabChange: (tab: GuideTab) => void;
  onCommonQuestionClick: (question: string, tab: GuideTab) => void;
  onQuickGuideClick?: (tab: GuideTab) => void;
  onOpenChatbot?: (initialQuestion: string | undefined, tab: GuideTab) => void;
  onNavigateToGuide?: (howHappened: string) => void;
  initialScamType?: string;
  onScamTypeConsumed?: () => void;
};

export function HeroSection({
  locale,
  localeLabels,
  brandName,
  slogan,
  guideDescription,
  chatbotTitle,
  tabs,
  activeTabKey,
  promptPlaceholder,
  onTabChange,
  onQuickGuideClick,
  onOpenChatbot,
  onNavigateToGuide,
  initialScamType,
  onScamTypeConsumed
}: HeroSectionProps) {
  const activeTab = tabs.find((tab) => tab.key === activeTabKey) ?? tabs[0];
  const hasSecondaryGuideAction = activeTab.key === "scam" && Boolean(activeTab.recogniserActionLabel);
  const [isRecogniserOpen, setIsRecogniserOpen] = useState(false);
  const promptPlaceholderOptions = activeTab.quickPills.length > 0 ? activeTab.quickPills : [promptPlaceholder];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Auto-open dialog when initialScamType is provided via URL
  useEffect(() => {
    if (initialScamType) {
      setIsRecogniserOpen(true);
    }
  }, [initialScamType]);

  useEffect(() => {
    setPlaceholderIndex(0);
  }, [activeTab.key]);

  useEffect(() => {
    if (promptPlaceholderOptions.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % promptPlaceholderOptions.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [promptPlaceholderOptions]);

  const activePlaceholder = promptPlaceholderOptions[placeholderIndex] ?? promptPlaceholder;

  const sanitizePromptSeed = (value: string) => value.replace(/^["“”']+|["“”']+$/gu, "").trim();

  const handlePromptOpen = () => {
    const seed = sanitizePromptSeed(activePlaceholder);
    onOpenChatbot?.(seed || undefined, activeTab);
  };

  return (
    <section className="hero">
      <div className="brand-block">
        <h1 className="hero-brand">{brandName}</h1>
        <p className="hero-slogan">{slogan}</p>
      </div>

      <div className="guide-card">
        <div className="guide-intro">
          <p className="guide-intro__description">{guideDescription}</p>
        </div>

        <div className="guide-tabs" role="tablist" aria-label={localeLabels?.quickGuideTopicsAria ?? "Quick guide topics"}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab.key;

            return (
              <button
                key={tab.key}
                className={`guide-tab${isActive ? " guide-tab--active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab)}
              >
                <span>{tab.label}</span>
                {isActive ? <span className="guide-tab__underline" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <ul className="guide-list">
          {activeTab.bullets.map((item) => (
            <li key={item.id} className="guide-list__item">
              {item.segments.map((segment, index) => (
                <span key={`${item.id}-${index}`} className={segment.highlighted ? "guide-highlight" : undefined}>
                  {segment.text}
                </span>
              ))}
            </li>
          ))}
        </ul>

        <div className="quick-guide-actions">
          {hasSecondaryGuideAction ? (
            <button
              className="quick-guide-button quick-guide-button--secondary"
              type="button"
              onClick={() => setIsRecogniserOpen(true)}
            >
              <SuspiciousTextIcon />
              <span>{activeTab.recogniserActionLabel}</span>
            </button>
          ) : null}
          <button className="quick-guide-button" type="button" onClick={() => onQuickGuideClick?.(activeTab)}>
            <span>{activeTab.actionLabel}</span>
            <ArrowCircleIcon />
          </button>
        </div>
      </div>

      <div className={`hero-chatbot${hasSecondaryGuideAction ? " hero-chatbot--with-secondary-actions" : ""}`}>
        <div className="hero-chatbot__header">
          <h2 className="hero-chatbot__title">{chatbotTitle}</h2>
        </div>

        <div className="prompt-shell prompt-shell--button">
          <div className="prompt-field" onClick={handlePromptOpen}>
            <span className="prompt-placeholder" aria-hidden="true">
              “{activePlaceholder}”
            </span>
            <input
              className="prompt-input prompt-input--launcher"
              type="text"
              placeholder=""
              value=""
              readOnly
              onFocus={handlePromptOpen}
              onClick={handlePromptOpen}
              aria-label={localeLabels?.chatbotInputAria ?? "Type your question for the AI chatbot"}
            />
          </div>

          <button
            className="ask-ai-button"
            type="button"
            onClick={handlePromptOpen}
          >
            <StarIcon />
            <span>{localeLabels?.askAi ?? "Ask AI"}</span>
          </button>
        </div>
      </div>

      <ScamRecogniserDialog
        locale={locale}
        isOpen={isRecogniserOpen}
        initialType={initialScamType}
        onClose={() => {
          setIsRecogniserOpen(false);
          onScamTypeConsumed?.();
        }}
        onNavigateToGuide={(howHappened) => onNavigateToGuide?.(howHappened)}
      />
    </section>
  );
}
