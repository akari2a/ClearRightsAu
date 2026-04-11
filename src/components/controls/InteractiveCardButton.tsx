import type { ButtonHTMLAttributes, ReactNode } from "react";

type InteractiveCardButtonProps = {
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function InteractiveCardButton({
  className = "",
  type = "button",
  children,
  ...props
}: InteractiveCardButtonProps) {
  const resolvedClassName = className
    ? `interactive-card-button ${className}`.trim()
    : "interactive-card-button";

  return (
    <button type={type} className={resolvedClassName} {...props}>
      {children}
    </button>
  );
}
