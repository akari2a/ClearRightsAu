import { HeaderNavButton } from "./HeaderNavButton";

type SecondaryNavItem = {
  id: string;
  label: string;
};

type HeaderDropdownNavItemProps = {
  label: string;
  isActive?: boolean;
  isOpen?: boolean;
  panelLabel: string;
  items: SecondaryNavItem[];
  onOpen: () => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: (id: string) => void;
};

export function HeaderDropdownNavItem({
  label,
  isActive = false,
  isOpen = false,
  panelLabel,
  items,
  onOpen,
  onPrimaryClick,
  onSecondaryClick
}: HeaderDropdownNavItemProps) {
  return (
    <div className="nav-dropdown-anchor" onMouseEnter={onOpen} onFocus={onOpen}>
      <HeaderNavButton label={label} isActive={isActive} onMouseEnter={onOpen} onFocus={onOpen} onClick={onPrimaryClick} />

      {isOpen ? (
        <div className="subnav-panel" aria-label={`${label} secondary navigation`}>
          <div className="subnav-panel__header">{panelLabel}</div>
          <div className="subnav-panel__list">
            {items.map((item) => (
              <button key={item.id} className="subnav-link" type="button" onClick={() => onSecondaryClick?.(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
