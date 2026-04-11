import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type CommonProps = {
  className?: string;
  children: ReactNode;
};

type RouterLinkProps = CommonProps & {
  to: string;
  onClick?: never;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

type TextActionLinkProps = RouterLinkProps | ButtonProps;

export function TextActionLink(props: TextActionLinkProps) {
  const baseClassName = props.className ? `text-action-link ${props.className}` : "text-action-link";

  if ("to" in props && props.to !== undefined) {
    const { to, children } = props;
    return (
      <Link className={baseClassName} to={to}>
        {children}
      </Link>
    );
  }

  const { children, className: _className, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={baseClassName} {...buttonProps}>
      {children}
    </button>
  );
}
