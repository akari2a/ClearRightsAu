import type { ReactNode } from "react";

type HeaderNavButtonProps = {
  label: string;
  isActive?: boolean;
  children?: ReactNode;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
};

export function HeaderNavButton({
  label,
  isActive = false,
  children,
  onMouseEnter,
  onFocus,
  onClick
}: HeaderNavButtonProps) {
  return (
    <button
      className={`nav-item${isActive ? " nav-item--active" : ""}`}
      type="button"
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onClick={onClick}
    >
      {children ?? label}
    </button>
  );
}
