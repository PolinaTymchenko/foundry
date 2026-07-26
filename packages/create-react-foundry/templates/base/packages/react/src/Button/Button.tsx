import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { warnIfMissingAccessibleName } from "../internal/a11y.js";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /** Visual style. @default "primary" */
  variant?: ButtonVariant;
  /** Size scale. @default "md" */
  size?: ButtonSize;
  /**
   * Shows a spinner and marks the button aria-busy. The button stays
   * disabled while loading — a click can't fire and complete twice.
   * @default false
   */
  loading?: boolean;
  /** @default false */
  disabled?: boolean;
  /** Icon rendered before the label. Purely decorative — kept out of the accessibility tree. */
  iconStart?: ReactNode;
  /** Icon rendered after the label. Purely decorative — kept out of the accessibility tree. */
  iconEnd?: ReactNode;
  children?: ReactNode;
}

/**
 * A button that renders a real <button> element, so keyboard activation
 * (Enter/Space) and focus behavior come from the browser for free rather
 * than being reimplemented.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    iconStart,
    iconEnd,
    children,
    className,
    type = "button",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  warnIfMissingAccessibleName({
    component: "Button",
    hasAccessibleContent: Boolean(children),
    ariaLabel,
    ariaLabelledBy,
    guidance:
      'an icon-only button (no visible text) needs an accessible name. Pass aria-label="..." so assistive technology can announce what it does.',
  });

  const classNames = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
    >
      {loading ? (
        <ButtonSpinner />
      ) : iconStart ? (
        <span className={styles.icon} aria-hidden="true">
          {iconStart}
        </span>
      ) : null}
      {children ? <span className={styles.label}>{children}</span> : null}
      {!loading && iconEnd ? (
        <span className={styles.icon} aria-hidden="true">
          {iconEnd}
        </span>
      ) : null}
    </button>
  );
});

function ButtonSpinner() {
  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="56.5"
        strokeDashoffset="42.5"
      />
    </svg>
  );
}
