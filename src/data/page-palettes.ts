export const pagePalettes = ["default", "blue"] as const;

export type PagePalette = (typeof pagePalettes)[number];

export const defaultPagePalette: PagePalette = "default";
