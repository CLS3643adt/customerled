/** Customer Led Strategy brand tokens for Office exports. */
export const CLS_BRAND = {
  name: "Customer Led Strategy",
  shortName: "CLS",
  tagline: "Customer-led strategy, delivery, and change",
  colors: {
    primary: "1BAA7C",
    primaryDark: "117B63",
    primaryLight: "EAFBF5",
    accent: "F45BB5",
    accentDark: "D74498",
    accentLight: "FFF1F8",
    text: "181818",
    textWeak: "3E3E3C",
    border: "D9D9D9",
    bg: "F7F7F5",
    white: "FFFFFF",
    success: "2E844A",
  },
  fonts: {
    heading: "Calibri",
    body: "Calibri",
  },
} as const;

export type ClsBrand = typeof CLS_BRAND;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "item";
}

export function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}
