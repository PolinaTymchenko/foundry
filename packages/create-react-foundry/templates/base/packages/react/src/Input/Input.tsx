import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { warnIfMissingAccessibleName } from "../internal/a11y.js";
import { useControlledState } from "../internal/useControlledState.js";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange"
  > {
  /** Visible label, rendered as a real <label>, associated via htmlFor/id. */
  label?: ReactNode;
  /** Helper text shown below the input, wired to the input via aria-describedby. */
  description?: string;
  /** Validation message. Presence alone sets aria-invalid and styles the error state. */
  error?: string;
  /** Size scale. @default "md" */
  size?: InputSize;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  /** Controlled value. Omit entirely (use defaultValue) to let Input manage its own state. */
  value?: string;
  /** Initial value for uncontrolled usage. @default "" */
  defaultValue?: string;
  /** Called with the new value on every change — not the raw DOM event. */
  onChange?: (value: string) => void;
}

/**
 * A labeled text input supporting both controlled and uncontrolled usage
 * (see useControlledState / ADR-0001), with description and error text
 * correctly wired into the accessibility tree via aria-describedby.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    error,
    size = "md",
    required = false,
    disabled = false,
    value,
    defaultValue = "",
    onChange,
    className,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const [currentValue, setValue] = useControlledState(value, defaultValue, onChange);

  warnIfMissingAccessibleName({
    component: "Input",
    hasAccessibleContent: Boolean(label),
    ariaLabel,
    ariaLabelledBy,
    guidance:
      'an input with no visible label needs an accessible name. Pass "label", or aria-label="..." if a visible label isn\'t appropriate here.',
  });

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")} data-size={size}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        {...rest}
        ref={ref}
        id={inputId}
        className={styles.input}
        data-size={size}
        data-invalid={Boolean(error) || undefined}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value={currentValue}
        onChange={(event) => setValue(event.target.value)}
      />
      {description ? (
        <p className={styles.description} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
