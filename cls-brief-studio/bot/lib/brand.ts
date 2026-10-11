/** Customer Led Strategy brand tokens for Office exports. */
export const CLS_BRAND = {
  name: "Customer Led Strategy",
  shortName: "CLS",
  tagline: "Customer-led strategy, delivery, and change",
  colors: {
    purple: "6B2FB5",
    purpleDark: "4E1F8A",
    purpleLight: "F4ECFC",
    orange: "F4841F",
    orangeDark: "D66A0A",
    orangeLight: "FFF4E8",
    text: "181818",
    textWeak: "3E3E3C",
    border: "C9C9C9",
    bg: "F3F3F3",
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
