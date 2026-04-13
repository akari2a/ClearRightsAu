import { useEffect, useState } from "react";
import { ArrowCircleIcon, StarIcon, SuspiciousTextIcon } from "../icons";
import { InteractiveCardButton } from "../controls/InteractiveCardButton";
import { ScamRecogniserDialog } from "./ScamRecogniserDialog";
import type { GuideTab, TabKey } from "../../types/home";

type HeroSectionProps = {
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
  localeLabels,
  brandName,
  slogan,
  guideDescription,
  chatbotTitle,
  tabs,
  commonQuestions,
  activeTabKey,
  promptPlaceholder,
  onTabChange,
  onCommonQuestionClick,
  onQuickGuideClick,
  onOpenChatbot,
  onNavigateToGuide,
  initialScamType,
  onScamTypeConsumed
}: HeroSectionProps) {
  const activeTab = tabs.find((tab) => tab.key === activeTabKey) ?? tabs[0];
  const hasSecondaryGuideAction = activeTab.key === "scam" && Boolean(activeTab.recogniserActionLabel);
  const [promptInput, setPromptInput] = useState("");
  const [isRecogniserOpen, setIsRecogniserOpen] = useState(false);

  // Auto-open dialog when initialScamType is provided via URL
  useEffect(() => {
    if (initialScamType) {
      setIsRecogniserOpen(true);
    }
  }, [initialScamType]);

  const handlePromptSubmit = () => {
    const trimmed = promptInput.trim();
    onOpenChatbot?.(trimmed || undefined, activeTab);
    setPromptInput("");
  };

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit();
    }
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

        <div className="hero-common-questions" aria-label={localeLabels?.suggestedQuestionsAria ?? "Suggested questions"}>
          <div className="popular-grid popular-grid--hero">
            {commonQuestions.map((item) => (
              <InteractiveCardButton
                key={item}
                className="popular-link popular-link--prompt"
                onClick={() => onCommonQuestionClick(item, activeTab)}
              >
                <span className="popular-link__quote" aria-hidden="true">
                  “
                </span>
                <span>{item}</span>
              </InteractiveCardButton>
            ))}
          </div>
        </div>

        <div className="prompt-shell">
          <div className="prompt-field">
            <input
              className="prompt-input"
              type="text"
              placeholder={promptPlaceholder}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              aria-label={localeLabels?.chatbotInputAria ?? "Type your question for the AI chatbot"}
            />
          </div>

          <button
            className="ask-ai-button"
            type="button"
            onClick={handlePromptSubmit}
          >
            <StarIcon />
            <span>{localeLabels?.askAi ?? "Ask AI"}</span>
          </button>
        </div>
      </div>

      <ScamRecogniserDialog
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
