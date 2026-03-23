import OpenAI from "openai";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { glob } from "tinyglobby";

const SERVICES_DIR = path.resolve("src/content/services");
const MAX_SERVICES = 20;
const RATE_LIMIT_MS = 500;

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface EnrichmentResult {
  longDescription: string;
  faq: FAQItem[];
}

async function fetchOGMetadata(url: string): Promise<OGMetadata> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Dalink-Bot/1.0; +https://dal.ink)",
      },
    });
    clearTimeout(timeoutId);

    const html = await response.text();
    const og: OGMetadata = {};

    const metaRegex =
      /<meta\s+(?:property|name)=["'](og:[^"']+|description)["']\s+content=["']([^"']*)["'][^>]*>/gi;
    let match: RegExpExecArray | null;

    while ((match = metaRegex.exec(html)) !== null) {
      const prop = match[1].toLowerCase();
      const content = match[2];
      if (prop === "og:title") og.title = content;
      else if (prop === "og:description" || prop === "description")
        og.description = og.description ?? content;
      else if (prop === "og:image") og.image = content;
      else if (prop === "og:site_name") og.siteName = content;
    }

    return og;
  } catch {
    return {};
  }
}

async function callOpenAI(
  client: OpenAI,
  frontmatter: Record<string, unknown>,
  og: OGMetadata,
  body: string
): Promise<EnrichmentResult | null> {
  const userPrompt = `Service name: ${frontmatter.name}
URL: ${frontmatter.url}
Type: ${frontmatter.type ?? ""}
Description: ${frontmatter.description ?? ""}
Category: ${frontmatter.category ?? ""}
OG Title: ${og.title ?? ""}
OG Description: ${og.description ?? ""}
OG Site Name: ${og.siteName ?? ""}
Body (first 500 chars): ${body.slice(0, 500)}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a tech service reviewer for dal.ink, a service directory. Given a service\'s metadata and website content, generate: 1. longDescription (Korean, 200-400자, 서비스의 핵심 가치와 특징) 2. faq (Korean, 3개 Q&A, 사용자가 자주 묻는 질문). Output as JSON: { longDescription: string, faq: [{question: string, answer: string}] }',
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as EnrichmentResult;
    if (
      typeof parsed.longDescription !== "string" ||
      !Array.isArray(parsed.faq)
    ) {
      return null;
    }

    return parsed;
  } catch (err) {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log("OPENAI_API_KEY not set, skipping enrichment");
    process.exit(0);
  }

  const client = new OpenAI({ apiKey });

  const files = await glob("**/*.md", { cwd: SERVICES_DIR, absolute: true });

  let processed = 0;

  for (const filePath of files) {
    if (processed >= MAX_SERVICES) {
      console.log(`Reached max services limit (${MAX_SERVICES}), stopping.`);
      break;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);

    if (parsed.data.enriched === true) {
      console.log(`Skipping ${path.basename(filePath)} (already enriched)`);
      continue;
    }

    console.log(`Enriching ${path.basename(filePath)}...`);

    const og = await fetchOGMetadata(String(parsed.data.url ?? ""));

    const result = await callOpenAI(client, parsed.data, og, parsed.content);

    if (!result) {
      console.error(
        `Failed to enrich ${path.basename(filePath)}, skipping.`
      );
    } else {
      parsed.data.longDescription = result.longDescription;
      parsed.data.faq = result.faq;
      parsed.data.enriched = true;

      const output = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, output, "utf-8");
      console.log(`Enriched ${path.basename(filePath)}`);
      processed++;
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log(`Enrichment complete. Processed ${processed} services.`);
}

main().catch((err) => {
  console.error("Enrichment script failed:", err);
  process.exit(1);
});
