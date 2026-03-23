import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { glob } from "tinyglobby";

const SERVICES_DIR = path.resolve("src/content/services");
const PUBLIC_DIR = path.resolve("public");
const SCREENSHOT_MAX_BYTES = 500 * 1024; // 500KB

const ALLOWED_CATEGORIES = [
  "productivity",
  "developer-tools",
  "design",
  "communication",
  "education",
  "finance",
  "health",
  "entertainment",
  "social",
  "utilities",
  "ai",
  "other",
] as const;

const ALLOWED_TYPES = ["web", "app", "both"] as const;

const REQUIRED_FIELDS = [
  "name",
  "url",
  "description",
  "screenshot",
  "category",
  "tags",
  "author",
  "publishedAt",
] as const;

interface BlocklistData {
  keywords: Record<string, string[]>;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function isValidUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function loadBlocklist(): BlocklistData {
  const blocklistPath = path.resolve("scripts/blocklist.json");
  try {
    const raw = fs.readFileSync(blocklistPath, "utf-8");
    return JSON.parse(raw) as BlocklistData;
  } catch {
    return { keywords: {} };
  }
}

function checkBlocklist(
  blocklist: BlocklistData,
  fields: string[],
  fileName: string,
  errors: string[]
): void {
  const combined = fields.join(" ").toLowerCase();
  for (const [category, terms] of Object.entries(blocklist.keywords)) {
    for (const term of terms) {
      if (combined.includes(term.toLowerCase())) {
        errors.push(
          `${fileName}: blocked keyword "${term}" (category: ${category}) found in service metadata`
        );
      }
    }
  }
}

async function main(): Promise<void> {
  const files = await glob("**/*.md", { cwd: SERVICES_DIR, absolute: true });
  const blocklist = loadBlocklist();

  const errors: string[] = [];
  const warnings: string[] = [];
  const seenUrls = new Map<string, string>();
  const seenSlugs = new Map<string, string>();

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    let parsed: matter.GrayMatterFile<string>;

    // 1. Frontmatter parsing
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      parsed = matter(raw);
    } catch (err) {
      errors.push(`${fileName}: failed to parse frontmatter: ${String(err)}`);
      continue;
    }

    const data = parsed.data;

    // 2. Required fields
    for (const field of REQUIRED_FIELDS) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        errors.push(`${fileName}: missing required field "${field}"`);
      }
    }

    // 3. URL format validation
    if (data.url !== undefined) {
      if (!isValidUrl(data.url)) {
        errors.push(`${fileName}: invalid URL format for field "url": ${data.url}`);
      } else {
        // Check for duplicate URLs
        const normalizedUrl = String(data.url).replace(/\/$/, "").toLowerCase();
        if (seenUrls.has(normalizedUrl)) {
          errors.push(
            `${fileName}: duplicate URL "${data.url}" (also in ${seenUrls.get(normalizedUrl)})`
          );
        } else {
          seenUrls.set(normalizedUrl, fileName);
        }
      }
    }

    // 3b. Slug conflict detection (filename without .md)
    const slug = path.basename(filePath, ".md");
    if (seenSlugs.has(slug)) {
      errors.push(
        `${fileName}: duplicate slug "${slug}" (conflicts with ${seenSlugs.get(slug)})`
      );
    } else {
      seenSlugs.set(slug, fileName);
    }

    // 4. Category validation
    if (data.category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(data.category as (typeof ALLOWED_CATEGORIES)[number])) {
        errors.push(
          `${fileName}: invalid category "${data.category}". Must be one of: ${ALLOWED_CATEGORIES.join(", ")}`
        );
      }
    }

    // 5. Tags array max length 5
    if (data.tags !== undefined) {
      if (!Array.isArray(data.tags)) {
        errors.push(`${fileName}: "tags" must be an array`);
      } else if (data.tags.length > 5) {
        errors.push(
          `${fileName}: "tags" array has ${data.tags.length} items, max is 5`
        );
      }
    }

    // 6. Description max 160 chars
    if (data.description !== undefined) {
      if (typeof data.description !== "string") {
        errors.push(`${fileName}: "description" must be a string`);
      } else if (data.description.length > 160) {
        errors.push(
          `${fileName}: "description" is ${data.description.length} chars, max is 160`
        );
      }
    }

    // 7. Screenshot file exists in public/ and is < 500KB (PNG/JPG/WebP)
    if (data.screenshot !== undefined) {
      if (typeof data.screenshot !== "string") {
        errors.push(`${fileName}: "screenshot" must be a string path`);
      } else {
        const screenshotPath = path.join(PUBLIC_DIR, data.screenshot);
        const ext = path.extname(data.screenshot).toLowerCase();

        if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
          errors.push(
            `${fileName}: screenshot "${data.screenshot}" must be PNG, JPG, or WebP`
          );
        }

        if (!fs.existsSync(screenshotPath)) {
          errors.push(
            `${fileName}: screenshot file not found at public${data.screenshot}`
          );
        } else {
          const stats = fs.statSync(screenshotPath);
          if (stats.size > SCREENSHOT_MAX_BYTES) {
            errors.push(
              `${fileName}: screenshot file is ${Math.round(stats.size / 1024)}KB, max is 500KB`
            );
          }
        }
      }
    }

    // 8. type must be web/app/both if provided
    if (data.type !== undefined) {
      if (!ALLOWED_TYPES.includes(data.type as (typeof ALLOWED_TYPES)[number])) {
        errors.push(
          `${fileName}: invalid type "${data.type}". Must be one of: ${ALLOWED_TYPES.join(", ")}`
        );
      }
    }

    // 9. Blocklist check
    const textFields = [
      typeof data.name === "string" ? data.name : "",
      typeof data.description === "string" ? data.description : "",
      typeof data.url === "string" ? data.url : "",
      Array.isArray(data.tags)
        ? (data.tags as unknown[])
            .filter((t): t is string => typeof t === "string")
            .join(" ")
        : "",
    ];
    checkBlocklist(blocklist, textFields, fileName, errors);
  }

  const result: ValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
  };

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(result.valid ? 0 : 1);
}

main().catch((err) => {
  const result: ValidationResult = {
    valid: false,
    errors: [`Validation script failed: ${String(err)}`],
    warnings: [],
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(1);
});
