import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.enum(["web", "app", "both"]).default("web"),
    // Bilingual description (at least one required)
    description_ko: z.string().max(160).optional(),
    description_en: z.string().max(160).optional(),
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
    // Bilingual long description
    longDescription_ko: z.string().optional(),
    longDescription_en: z.string().optional(),
    ogImage: z.string().optional(),
    // Bilingual FAQ
    faq_ko: z.array(faqItem).optional(),
    faq_en: z.array(faqItem).optional(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    enriched: z.boolean().default(false),
  }).refine(
    (data) => data.description_ko || data.description_en,
    { message: "At least one of description_ko or description_en is required" }
  ),
});

export const collections = { services };
