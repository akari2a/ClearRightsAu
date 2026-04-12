import { FooterLinkGroup } from "./footer/FooterLinkGroup";
import { getUiCopy } from "../../i18n/copy";
import type { AppLocale } from "../../i18n/config";

type SiteFooterProps = {
  locale?: AppLocale;
};

export function SiteFooter({ locale = "en" }: SiteFooterProps) {
  const uiCopy = getUiCopy(locale);
  const footerGroups = [
    {
      title: uiCopy.footer.navigateTitle,
      links: uiCopy.footer.navigateLinks
    },
    {
      title: uiCopy.footer.topicsTitle,
      links: uiCopy.footer.topicsLinks
    },
    {
      title: uiCopy.footer.accessibilityTitle,
      links: uiCopy.footer.accessibilityLinks
    }
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <h2 className="site-footer__brand-name">ClearRights</h2>
          <p className="site-footer__brand-copy">
            {uiCopy.footer.brandCopy}
          </p>
        </div>

        <div className="site-footer__links">
          {footerGroups.map((group) => (
            <FooterLinkGroup key={group.title} title={group.title} links={group.links} />
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__meta">{uiCopy.footer.meta}</p>
        <p className="site-footer__meta">© 2026 ClearRights</p>
      </div>
    </footer>
  );
}
