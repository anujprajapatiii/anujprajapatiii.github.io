import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared schema — Work ("projects") and Play use the same case-study shape.
const caseStudySchema = z.object({
  title: z.string(),
  description: z.string(),
  role: z.string().optional(),
  year: z.string().optional(),
  skills: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  heroImage: z.string().optional(),
  sortOrder: z.number().default(0),
  draft: z.boolean().default(false),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: caseStudySchema,
});

const play = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/play" }),
  schema: caseStudySchema,
});

export const collections = { projects, play };
