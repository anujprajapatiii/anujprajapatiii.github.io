export const projectTypes = ["brand", "campaign", "product"] as const;

export type ProjectType = (typeof projectTypes)[number];

export const projectTypeLabels: Record<ProjectType, string> = {
  brand: "Brand",
  campaign: "Campaign",
  product: "Product",
};
