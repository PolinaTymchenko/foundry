export interface AccessibleNameCheckOptions {
  /** Component name, used only in the warning message. */
  component: string;
  /** True if the component already has visible text content acting as its name. */
  hasAccessibleContent: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /** Component-specific guidance appended to the warning. */
  guidance: string;
}

/**
 * Warns in development when a component has no way to announce itself to
 * assistive technology — no visible text, no aria-label, no
 * aria-labelledby. Shared so every component with this failure mode (an
 * icon-only Button, a label-less Input, ...) checks it the same way,
 * instead of each hand-rolling its own version of the same condition.
 */
export function warnIfMissingAccessibleName({
  component,
  hasAccessibleContent,
  ariaLabel,
  ariaLabelledBy,
  guidance,
}: AccessibleNameCheckOptions): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  if (hasAccessibleContent || ariaLabel || ariaLabelledBy) {
    return;
  }
  console.warn(`${component}: ${guidance}`);
}
