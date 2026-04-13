const LANGUAGE_ICON_URL = "https://www.figma.com/api/mcp/asset/b4ffa90b-2f74-4931-8d3d-7972e6d964f8";
export const ASK_AI_ICON_URL = "https://www.figma.com/api/mcp/asset/e8772297-4b68-4480-b08e-1d22935e4323";
const QUICK_GUIDE_ARROW_DEFAULT_URL = "https://www.figma.com/api/mcp/asset/ba468f45-7d56-42a7-be2b-99386de150b9";
const QUICK_GUIDE_ARROW_HOVER_URL = "https://www.figma.com/api/mcp/asset/a53fe59f-b767-4bfe-923c-eb12fa12f803";
const QUICK_GUIDE_ARROW_PRESSED_URL = "https://www.figma.com/api/mcp/asset/4c856ea4-3dbd-4367-a585-cae19262c0da";

export function GlobeIcon() {
  return <img src={LANGUAGE_ICON_URL} alt="" />;
}

export function StarIcon() {
  return <img src={ASK_AI_ICON_URL} alt="" />;
}

export function ArrowCircleIcon() {
  return (
    <span className="quick-guide-icon" aria-hidden="true">
      <img className="quick-guide-icon__img quick-guide-icon__img--default" src={QUICK_GUIDE_ARROW_DEFAULT_URL} alt="" />
      <img className="quick-guide-icon__img quick-guide-icon__img--hover" src={QUICK_GUIDE_ARROW_HOVER_URL} alt="" />
      <img className="quick-guide-icon__img quick-guide-icon__img--pressed" src={QUICK_GUIDE_ARROW_PRESSED_URL} alt="" />
    </span>
  );
}

export function SuspiciousTextIcon() {
  return (
    <span className="quick-guide-button__icon-badge" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="M14.6 14.6 19 19" />
        <path d="m8.6 10.5 1.2 1.2 2.7-2.9" />
      </svg>
    </span>
  );
}
