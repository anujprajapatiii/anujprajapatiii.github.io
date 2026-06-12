import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    role: z.string().optional(),
    year: z.string().optional(),
    skills: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    heroImage: z.string().optional(),
    sortOrder: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
