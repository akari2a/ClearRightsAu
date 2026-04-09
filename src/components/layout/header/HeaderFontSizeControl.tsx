type HeaderFontSizeControlProps = {
  activeFontSize: "small" | "default" | "large";
  onFontSizeChange?: (size: "small" | "default" | "large") => void;
};

export function HeaderFontSizeControl({ activeFontSize, onFontSizeChange }: HeaderFontSizeControlProps) {
  return (
    <div className="font-size-control" role="group" aria-label="Text size">
      <button
        className={`font-size-control__button${activeFontSize === "small" ? " font-size-control__button--active" : ""}`}
        type="button"
        aria-label="Small text"
        onClick={() => onFontSizeChange?.("small")}
      >
        A-
      </button>
      <button
        className={`font-size-control__button${activeFontSize === "default" ? " font-size-control__button--active" : ""}`}
        type="button"
        aria-label="Default text"
        onClick={() => onFontSizeChange?.("default")}
      >
        A
      </button>
      <button
        className={`font-size-control__button${activeFontSize === "large" ? " font-size-control__button--active" : ""}`}
        type="button"
        aria-label="Large text"
        onClick={() => onFontSizeChange?.("large")}
      >
        A+
      </button>
    </div>
  );
}
