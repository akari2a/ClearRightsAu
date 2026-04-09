import { ArrowCircleIcon, StarIcon } from "../icons";
import type { GuideTab, TabKey } from "../../types/home";

type HeroSectionProps = {
  brandName: string;
  slogan: string;
  guideDescription: string;
  tabs: GuideTab[];
  activeTabKey: TabKey;
  promptPlaceholder: string;
  inputValue: string;
  onTabChange: (tab: GuideTab) => void;
  onQuickPillClick: (pill: string) => void;
  onInputChange: (value: string) => void;
  onQuickGuideClick?: (tab: GuideTab) => void;
  onAskAiClick?: (value: string, tab: GuideTab) => void;
};

export function HeroSection({
  brandName,
  slogan,
  guideDescription,
  tabs,
  activeTabKey,
  promptPlaceholder,
  inputValue,
  onTabChange,
  onQuickPillClick,
  onInputChange,
  onQuickGuideClick,
  onAskAiClick
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

      <div className="quick-pill-row" aria-label="Suggested prompts">
        {activeTab.quickPills.map((pill, index) => (
          <button key={`${activeTab.key}-${index}`} className="quick-pill" type="button" onClick={() => onQuickPillClick(pill)}>
            {pill}
          </button>
        ))}
      </div>

      <div className="prompt-shell">
        <div className="prompt-field">
          {!inputValue ? <span className="prompt-placeholder">{promptPlaceholder}</span> : null}
          <input
            className="prompt-input"
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            aria-label="Describe your consumer rights issue"
          />
        </div>

        <button
          className="ask-ai-button"
          type="button"
          aria-label="Ask AI (not implemented)"
          onClick={() => onAskAiClick?.(inputValue, activeTab)}
        >
          <StarIcon />
          <span>Ask AI</span>
        </button>
      </div>
    </section>
  );
}
