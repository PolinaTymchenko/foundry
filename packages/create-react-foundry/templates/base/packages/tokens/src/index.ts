/**
 * Typed references to the CSS custom properties defined in tokens.css.
 * Import "{{packageScope}}/tokens/tokens.css" once, near your app root, then
 * reference these constants instead of writing var(--{{tokenPrefix}}-...)
 * strings by hand.
 *
 * These export names are the stable public API — they don't change even if
 * --token-prefix does. Only the string each one resolves to changes.
 */

export const colorBg = "var(--{{tokenPrefix}}-color-bg)";
export const colorFg = "var(--{{tokenPrefix}}-color-fg)";
export const colorMuted = "var(--{{tokenPrefix}}-color-muted)";
export const colorMutedFg = "var(--{{tokenPrefix}}-color-muted-fg)";
export const colorBorder = "var(--{{tokenPrefix}}-color-border)";
export const colorPrimary = "var(--{{tokenPrefix}}-color-primary)";
export const colorPrimaryFg = "var(--{{tokenPrefix}}-color-primary-fg)";
export const colorDanger = "var(--{{tokenPrefix}}-color-danger)";
export const colorDangerFg = "var(--{{tokenPrefix}}-color-danger-fg)";

export const spaceXs = "var(--{{tokenPrefix}}-space-xs)";
export const spaceSm = "var(--{{tokenPrefix}}-space-sm)";
export const spaceMd = "var(--{{tokenPrefix}}-space-md)";
export const spaceLg = "var(--{{tokenPrefix}}-space-lg)";
export const spaceXl = "var(--{{tokenPrefix}}-space-xl)";

export const radiusSm = "var(--{{tokenPrefix}}-radius-sm)";
export const radiusMd = "var(--{{tokenPrefix}}-radius-md)";
export const radiusLg = "var(--{{tokenPrefix}}-radius-lg)";
export const radiusFull = "var(--{{tokenPrefix}}-radius-full)";

export const fontSans = "var(--{{tokenPrefix}}-font-sans)";
export const fontMono = "var(--{{tokenPrefix}}-font-mono)";
export const textSm = "var(--{{tokenPrefix}}-text-sm)";
export const textMd = "var(--{{tokenPrefix}}-text-md)";
export const textLg = "var(--{{tokenPrefix}}-text-lg)";
export const weightRegular = "var(--{{tokenPrefix}}-weight-regular)";
export const weightMedium = "var(--{{tokenPrefix}}-weight-medium)";
export const weightBold = "var(--{{tokenPrefix}}-weight-bold)";

export const focusRing = "var(--{{tokenPrefix}}-focus-ring)";
