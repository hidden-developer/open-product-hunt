import { writeFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

async function main() {
  const url = process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.log('[fetch-votes] Supabase not configured, writing empty votes.json');
    writeFileSync(join(process.cwd(), 'public', 'votes.json'), JSON.stringify({ services: {} }));
    return;
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('dalink_vote_counts').select('*');

  const services: Record<string, { count: number }> = {};
  if (data) {
    for (const row of data) {
      services[row.service_slug] = { count: row.count };
    }
  }

  writeFileSync(
    join(process.cwd(), 'public', 'votes.json'),
    JSON.stringify({ fetchedAt: new Date().toISOString(), services }, null, 2)
  );

  console.log(`[fetch-votes] Cached ${Object.keys(services).length} vote counts`);
}

main();
