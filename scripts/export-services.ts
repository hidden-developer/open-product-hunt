import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { globSync } from 'tinyglobby';

function main() {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const files = globSync('**/*.md', { cwd: servicesDir });

  const services: Record<string, any> = {};

  for (const file of files) {
    const content = readFileSync(join(servicesDir, file), 'utf-8');
    const { data } = matter(content);
    const slug = file.replace(/\.md$/, '');

    services[slug] = {
      name: data.name,
      description_ko: data.description_ko,
      description_en: data.description_en,
      screenshot: data.screenshot,
      type: data.type,
      category: data.category,
      tags: data.tags,
    };
  }

  writeFileSync(
    join(process.cwd(), 'public', 'services.json'),
    JSON.stringify({ services }, null, 2)
  );

  console.log(`[export-services] Exported ${Object.keys(services).length} services`);
}

main();
