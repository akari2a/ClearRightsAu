import { ArrowCircleIcon, StarIcon } from "../icons";
import type { GuideTab, TabKey } from "../../types/home";

type HeroSectionProps = {
  brandName: string;
  slogan: string;
  guideDescription: string;
  tabs: GuideTab[];
  commonQuestions: string[];
  activeTabKey: TabKey;
  promptPlaceholder: string;
  onTabChange: (tab: GuideTab) => void;
  onCommonQuestionClick: (question: string, tab: GuideTab) => void;
  onQuickGuideClick?: (tab: GuideTab) => void;
  onOpenChatbot?: (initialQuestion: string | undefined, tab: GuideTab) => void;
};

export function HeroSection({
  brandName,
  slogan,
  guideDescription,
  tabs,
  commonQuestions,
  activeTabKey,
  promptPlaceholder,
  onTabChange,
  onCommonQuestionClick,
  onQuickGuideClick,
  onOpenChatbot
}: HeroSectionProps) {
  const activeTab = tabs.find((tab) => tab.key === activeTabKey) ?? tabs[0];

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

        <div className="guide-tabs" role="tablist" aria-label="Quick guide topics">
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

        <button className="quick-guide-button" type="button" onClick={() => onQuickGuideClick?.(activeTab)}>
          <span>{activeTab.actionLabel}</span>
          <ArrowCircleIcon />
        </button>
      </div>

      <div className="hero-chatbot">
        <div className="hero-chatbot__header">
          <h2 className="hero-chatbot__title">Start with a question</h2>
        </div>

        <div className="hero-common-questions" aria-label="Suggested questions">
          <div className="popular-grid popular-grid--hero">
            {commonQuestions.map((item) => (
              <button
                key={item}
                className="popular-link popular-link--prompt"
                type="button"
                onClick={() => onCommonQuestionClick(item, activeTab)}
              >
                <span className="popular-link__quote" aria-hidden="true">
                  “
                </span>
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="prompt-shell prompt-shell--button"
          type="button"
          aria-label="Open chatbot"
          onClick={() => onOpenChatbot?.(undefined, activeTab)}
        >
          <div className="prompt-field">
            <span className="prompt-placeholder prompt-placeholder--static">{promptPlaceholder}</span>
          </div>

          <span className="ask-ai-button" aria-hidden="true">
            <StarIcon />
            <span>Ask AI</span>
          </span>
        </button>
      </div>
    </section>
  );
}
