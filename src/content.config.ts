import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { pagePalettes } from "@/data/page-palettes";
import { projectTypes } from "@/lib/content/project-types";

const baseCaseStudyShape = {
  title: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.coerce.date(),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().positive().optional(),
  role: z.string().optional(),
  skills: z.array(z.string()).default([]),
  media: z
    .object({
      thumbnail: z.string().optional(),
      hero: z.string().optional(),
    })
    .default({}),
  // Authored page identity, independent of the visitor's light/dark mode.
  palette: z.enum(pagePalettes).default("default"),
};

function validateFeaturedOrder(
  data: { featured: boolean; featuredOrder?: number },
  context: z.RefinementCtx,
) {
  if (data.featured && data.featuredOrder === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuredOrder"],
      message: "Featured content needs a featuredOrder value.",
    });
  }
  if (!data.featured && data.featuredOrder !== undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuredOrder"],
      message: "featuredOrder is only valid when featured is true.",
    });
  }
}

const projectSchema = z
  .object({
    ...baseCaseStudyShape,
    type: z.enum(projectTypes),
  })
  .superRefine(validateFeaturedOrder);

const experimentSchema = z
  .object({
    ...baseCaseStudyShape,
  // Optional link to a live/deployed version (e.g. an interactive experiment
  // hosted in its own repo). Rendered as a "Try it live" link.
  liveUrl: z.string().url().optional(),
  // Optional URL to embed inline as an interactive iframe. Embeds are shown
  // at tablet width and up; below that a link is shown instead (see
  // .embed-frame in global.css). Usually the same as liveUrl.
  embedUrl: z.string().url().optional(),
  // Set this only when the embedded tool genuinely reflows for a phone. It
  // keeps the iframe below tablet width instead of swapping in the link, and
  // turns on the tap guard that stops the embed from swallowing page scroll.
  // Default off: most tools lay out for a mouse and a wide canvas.
  embedOnPhone: z.boolean().default(false),
  // Up to three stills or clips shown beside the Play list on the homepage
  // while a row is pointed at. The file extension decides which element
  // renders: .mp4/.webm/.mov become <video>, anything else an <img>.
  previews: z.array(z.string()).max(3).default([]),
  })
  .superRefine(validateFeaturedOrder);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: projectSchema,
});

const play = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/play" }),
  schema: experimentSchema,
});

export const collections = { projects, play };
