// scripts/health-check.ts
// Runs during build to check if registered services are still alive
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { globSync } from 'tinyglobby';

interface HealthResult {
  slug: string;
  url: string;
  status: 'live' | 'down' | 'error';
  statusCode: number | null;
  checkedAt: string; // ISO string
  responseTimeMs: number | null;
}

async function checkHealth(url: string): Promise<{ status: 'live' | 'down' | 'error'; statusCode: number | null; responseTimeMs: number | null }> {
  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    const responseTimeMs = Date.now() - start;
    const statusCode = response.status;
    const status = statusCode >= 200 && statusCode < 400 ? 'live' : 'down';
    return { status, statusCode, responseTimeMs };
  } catch (e) {
    return { status: 'error', statusCode: null, responseTimeMs: null };
  }
}

async function main() {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const files = globSync('**/*.md', { cwd: servicesDir });

  const results: Record<string, HealthResult> = {};

  for (const file of files) {
    const content = readFileSync(join(servicesDir, file), 'utf-8');
    const { data } = matter(content);
    const slug = file.replace(/\.md$/, '');
    const url = data.url as string;

    if (!url) continue;

    console.log(`Checking ${data.name} (${url})...`);
    const health = await checkHealth(url);

    results[slug] = {
      slug,
      url,
      ...health,
      checkedAt: new Date().toISOString(),
    };

    const icon = health.status === 'live' ? '✅' : '❌';
    console.log(`  ${icon} ${health.status} (${health.statusCode ?? 'N/A'}) ${health.responseTimeMs ? health.responseTimeMs + 'ms' : ''}`);

    // Small delay to avoid hammering
    await new Promise(r => setTimeout(r, 300));
  }

  const outputPath = join(process.cwd(), 'public/status.json');
  writeFileSync(outputPath, JSON.stringify({
    lastChecked: new Date().toISOString(),
    services: results
  }, null, 2));

  console.log(`\nHealth check complete. Results saved to public/status.json`);
}

main();
