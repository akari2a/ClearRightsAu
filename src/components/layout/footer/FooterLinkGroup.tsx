type FooterLinkGroupProps = {
  title: string;
  links: Array<{
    id: string;
    label: string;
    onClick: () => void;
  }>;
};

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className="site-footer__group">
      <h3 className="site-footer__group-title">{title}</h3>
      <ul className="site-footer__group-list">
        {links.map((link) => (
          <li key={link.id} className="site-footer__group-item">
            <button className="site-footer__link" type="button" onClick={link.onClick}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
