export const pagePalettes = ["default", "blue", "sage"] as const;

export type PagePalette = (typeof pagePalettes)[number];

export const defaultPagePalette: PagePalette = "default";
