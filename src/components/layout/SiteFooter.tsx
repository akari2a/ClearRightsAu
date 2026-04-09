import { FooterLinkGroup } from "./footer/FooterLinkGroup";

type FooterLinkGroup = {
  title: string;
  links: string[];
};

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Navigate",
    links: ["Home", "Questions", "Cases", "Guides", "AIBot"]
  },
  {
    title: "Popular topics",
    links: ["Scams", "Refunds", "Unsafe products", "Rental bonds"]
  },
  {
    title: "Accessibility",
    links: ["Text size", "Language support", "Simple explanations"]
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <h2 className="site-footer__brand-name">ClearRights</h2>
          <p className="site-footer__brand-copy">
            Clear, practical help for consumer problems, from first questions to next steps.
          </p>
        </div>

        <div className="site-footer__links">
          {FOOTER_LINK_GROUPS.map((group) => (
            <FooterLinkGroup key={group.title} title={group.title} links={group.links} />
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__meta">Designed to make consumer rights information easier to understand and act on.</p>
        <p className="site-footer__meta">© 2026 ClearRights</p>
      </div>
    </footer>
  );
}
