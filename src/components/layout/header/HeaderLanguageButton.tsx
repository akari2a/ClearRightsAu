import { GlobeIcon } from "../../icons";

type HeaderLanguageButtonProps = {
  onClick?: () => void;
};

export function HeaderLanguageButton({ onClick }: HeaderLanguageButtonProps) {
  return (
    <button className="language-pill" type="button" aria-label="Language selector" onClick={onClick}>
      <GlobeIcon />
      <span>English</span>
    </button>
  );
}
