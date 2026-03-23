import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map(s => ({ params: { slug: s.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  const services = await getCollection('services');
  const service = services.find(s => s.id === slug);
  const name = service?.data.name ?? slug;

  // Simple SVG badge: "Listed on dal.ink"
  const textWidth = Math.max(name.length * 7, 60);
  const totalWidth = 90 + textWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Listed on dal.ink">
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
    <g clip-path="url(#r)">
      <rect width="90" height="20" fill="#555"/>
      <rect x="90" width="${textWidth}" height="20" fill="#4c1"/>
    </g>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
      <text x="45" y="14">dal.ink</text>
      <text x="${90 + textWidth/2}" y="14">${name}</text>
    </g>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  });
};
