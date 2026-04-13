type ResultTextPairProps = {
  primary: string;
  secondary?: string | null;
  enabled?: boolean;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
};

function normalize(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function shouldShowResultComparison(primary: string, secondary?: string | null, enabled?: boolean) {
  if (!enabled) {
    return false;
  }

  const normalizedPrimary = normalize(primary);
  const normalizedSecondary = normalize(secondary);

  return normalizedSecondary.length > 0 && normalizedPrimary !== normalizedSecondary;
}

export function ResultTextPair({
  primary,
  secondary,
  enabled = false,
  className,
  primaryClassName,
  secondaryClassName
}: ResultTextPairProps) {
  const showSecondary = shouldShowResultComparison(primary, secondary, enabled);

  return (
    <span className={["result-text-pair", className].filter(Boolean).join(" ")}>
      <span className={["result-text-pair__primary", primaryClassName].filter(Boolean).join(" ")}>{primary}</span>
      {showSecondary ? (
        <span className={["result-text-pair__secondary", secondaryClassName].filter(Boolean).join(" ")}>
          {secondary}
        </span>
      ) : null}
    </span>
  );
}
