import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.enum(["web", "app", "both"]).default("web"),
    description: z.string().max(160),
    screenshot: z.string(),
    category: z.enum([
      "productivity", "developer-tools", "design", "communication",
      "education", "finance", "health", "entertainment",
      "social", "utilities", "ai", "other",
    ]),
    tags: z.array(z.string()).max(5),
    author: z.string(),
    repo: z.string().url().optional(),
    appStore: z.string().url().optional(),
    playStore: z.string().url().optional(),
    longDescription: z.string().optional(),
    ogImage: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    enriched: z.boolean().default(false),
  }),
});

export const collections = { services };
