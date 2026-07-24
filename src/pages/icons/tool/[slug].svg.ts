import type { APIRoute, GetStaticPaths } from 'astro';
import { tools } from '@data/registry';
import { toolIconSvg } from '@lib/icons/tool-icon';

// One maskable, full-bleed SVG app icon per tool, generated from registry data.
// Served at /icons/tool/<slug>.svg and referenced by the tool's web manifest
// and apple-touch-icon link. Deterministic, so the static file is stable.
export const getStaticPaths = (() =>
  tools.map(tool => ({ params: { slug: tool.slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) return new Response('Not found', { status: 404 });
  return new Response(toolIconSvg(tool), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
