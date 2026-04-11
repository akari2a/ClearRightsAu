import { TextActionLink } from "../controls/TextActionLink";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type SiteBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function SiteBreadcrumbs({ items }: SiteBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="site-breadcrumbs" aria-label="Breadcrumb">
      <ol className="site-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="site-breadcrumbs__item">
              {item.to && !isLast ? (
                <TextActionLink className="site-breadcrumbs__link" to={item.to}>
                  {item.label}
                </TextActionLink>
              ) : (
                <span
                  className={`site-breadcrumbs__label${isLast ? " site-breadcrumbs__label--current" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span className="site-breadcrumbs__separator" aria-hidden="true">
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
