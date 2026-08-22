import { getCollection, type CollectionEntry } from "astro:content";
import type { ProjectType } from "@/lib/content/project-types";

export type ContentSort = "newest" | "oldest" | "curated";

type PublishableEntry = {
  id: string;
  data: {
    publishedAt: Date;
    featured: boolean;
    featuredOrder?: number;
  };
};

interface QueryOptions {
  sort?: ContentSort;
  limit?: number;
}

interface ProjectQueryOptions extends QueryOptions {
  type?: ProjectType;
}

const byId = (a: PublishableEntry, b: PublishableEntry) =>
  a.id.localeCompare(b.id);

function sortEntries<T extends PublishableEntry>(
  entries: T[],
  sort: ContentSort,
) {
  return [...entries].sort((a, b) => {
    if (sort === "curated") {
      const order =
        (a.data.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.data.featuredOrder ?? Number.MAX_SAFE_INTEGER);
      return order || byId(a, b);
    }

    const date = a.data.publishedAt.getTime() - b.data.publishedAt.getTime();
    return (sort === "oldest" ? date : -date) || byId(a, b);
  });
}

function applyLimit<T>(entries: T[], limit?: number) {
  return limit === undefined ? entries : entries.slice(0, limit);
}

function validateFeaturedOrder<T extends PublishableEntry>(entries: T[]) {
  const positions = new Map<number, string>();

  for (const entry of entries) {
    const order = entry.data.featuredOrder;
    if (order === undefined) {
      throw new Error(
        `Featured content "${entry.id}" needs a featuredOrder value.`,
      );
    }

    const existing = positions.get(order);
    if (existing) {
      throw new Error(
        `Featured content "${existing}" and "${entry.id}" both use featuredOrder ${order}.`,
      );
    }
    positions.set(order, entry.id);
  }
}

export async function getPublishedProjects(
  { type, sort = "newest", limit }: ProjectQueryOptions = {},
): Promise<CollectionEntry<"projects">[]> {
  const projects = await getCollection(
    "projects",
    ({ data }) => data.status === "published",
  );
  const filtered = type
    ? projects.filter((project) => project.data.type === type)
    : projects;

  return applyLimit(sortEntries(filtered, sort), limit);
}

export async function getFeaturedProjects(limit?: number) {
  const projects = (await getPublishedProjects()).filter(
    ({ data }) => data.featured,
  );
  validateFeaturedOrder(projects);
  return applyLimit(sortEntries(projects, "curated"), limit);
}

export async function getPublishedExperiments(
  { sort = "newest", limit }: QueryOptions = {},
): Promise<CollectionEntry<"play">[]> {
  const experiments = await getCollection(
    "play",
    ({ data }) => data.status === "published",
  );
  return applyLimit(sortEntries(experiments, sort), limit);
}

export async function getFeaturedExperiments(limit?: number) {
  const experiments = (await getPublishedExperiments()).filter(
    ({ data }) => data.featured,
  );
  validateFeaturedOrder(experiments);
  return applyLimit(sortEntries(experiments, "curated"), limit);
}
