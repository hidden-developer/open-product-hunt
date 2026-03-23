import fs from 'fs';
import path from 'path';

interface Issue {
  number: number;
  title: string;
  body: string | null;
  user: { login: string; avatar_url: string };
  labels: { name: string }[];
  created_at: string;
  html_url: string;
  comments: number;
  reactions: { total_count: number; '+1': number };
}

function writeEmptyResult() {
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'issues.json'),
    JSON.stringify({ fetchedAt: new Date().toISOString(), issues: [] }, null, 2)
  );
}

async function main() {
  const repo = 'hidden-developer/open-product-hunt';
  const url = `https://api.github.com/repos/${repo}/issues?labels=service-request&state=open&per_page=50&sort=created&direction=desc`;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'dalink-builder',
  };

  // Use GITHUB_TOKEN if available (higher rate limit)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[fetch-issues] GitHub API returned ${res.status}, skipping`);
      // Write empty array so site still builds
      writeEmptyResult();
      return;
    }

    const issues: Issue[] = await res.json();

    const simplified = issues.map(issue => ({
      number: issue.number,
      title: issue.title.replace(/^\[Request\]\s*/i, ''),
      user: issue.user.login,
      avatar: issue.user.avatar_url,
      createdAt: issue.created_at,
      url: issue.html_url,
      comments: issue.comments,
      upvotes: issue.reactions?.['+1'] ?? 0,
    }));

    const output = path.join(process.cwd(), 'public', 'issues.json');
    fs.writeFileSync(output, JSON.stringify({
      fetchedAt: new Date().toISOString(),
      issues: simplified,
    }, null, 2));

    console.log(`[fetch-issues] Fetched ${simplified.length} service requests`);
  } catch (e) {
    console.warn('[fetch-issues] Failed to fetch issues:', e);
    writeEmptyResult();
  }
}

main();
