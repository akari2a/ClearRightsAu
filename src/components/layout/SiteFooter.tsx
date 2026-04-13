import { FooterLinkGroup } from "./footer/FooterLinkGroup";
import { getUiCopy } from "../../i18n/copy";
import type { AppLocale } from "../../i18n/config";
import { useNavigate } from "react-router-dom";

type SiteFooterProps = {
  locale?: AppLocale;
};

export function SiteFooter({ locale = "en" }: SiteFooterProps) {
  const navigate = useNavigate();
  const uiCopy = getUiCopy(locale);
  const footerGroups = [
    {
      title: uiCopy.footer.navigateTitle,
      links: [
        {
          id: "home",
          label: uiCopy.footer.navigateLinks.home,
          onClick: () => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
        {
          id: "guide",
          label: uiCopy.footer.navigateLinks.guide,
          onClick: () => {
            navigate("/scam-check");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
        {
          id: "cases",
          label: uiCopy.footer.navigateLinks.cases,
          onClick: () => {
            navigate("/cases");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
        {
          id: "aibot",
          label: uiCopy.footer.navigateLinks.aibot,
          onClick: () => {
            navigate("/aibot");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      ]
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
