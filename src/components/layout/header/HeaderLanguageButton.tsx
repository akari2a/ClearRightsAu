import { GlobeIcon } from "../../icons";

type HeaderLanguageButtonProps = {
  onClick?: () => void;
  label?: string;
  isOpen?: boolean;
};

export function HeaderLanguageButton({
  onClick,
  label = "English",
  isOpen = false
}: HeaderLanguageButtonProps) {
  return (
    <button
      className={`language-pill${isOpen ? " language-pill--open" : ""}`}
      type="button"
      aria-label="Language selector"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <GlobeIcon />
      <span>{label}</span>
    </button>
  );
}
