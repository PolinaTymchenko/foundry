import { useRef, useState } from "react";

/**
 * Backs the value/defaultValue/onChange triad (ADR-0001) for any component
 * that supports both controlled and uncontrolled usage. Warns in
 * development if a component switches modes across its lifetime — a
 * well-known React footgun that's easier to catch here, once, than to
 * rediscover per component.
 */
export function useControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const isControlled = value !== undefined;
  const wasControlledRef = useRef(isControlled);
  const [internalValue, setInternalValue] = useState(defaultValue);

  if (process.env.NODE_ENV !== "production" && wasControlledRef.current !== isControlled) {
    console.warn(
      `useControlledState: switched from ${wasControlledRef.current ? "controlled" : "uncontrolled"} to ${
        isControlled ? "controlled" : "uncontrolled"
      }. Decide on one for the lifetime of the component — pass value consistently, or not at all.`,
    );
  }
  wasControlledRef.current = isControlled;

  const currentValue = isControlled ? (value as T) : internalValue;

  const setValue = (next: T): void => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  return [currentValue, setValue];
}
