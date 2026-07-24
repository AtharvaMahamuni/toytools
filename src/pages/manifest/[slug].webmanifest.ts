import type { APIRoute, GetStaticPaths } from 'astro';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { iconColors } from '@lib/icons/tool-icon';
import { withBase } from '@lib/paths';

// One W3C web app manifest per tool, so each tool installs as its own home-screen
// app. Served at /manifest/<slug>.webmanifest and linked from the tool page head.
//
// Per-tool scope: a single-purpose tool should behave like a single-purpose app,
// so start_url + scope point at the tool's own URL. The icon is the maskable SVG
// from /icons/tool/<slug>.svg. Colours are the seeded category tones so the launch
// splash is icon-on-colour, never a white flash.
export const getStaticPaths = (() =>
  tools.map(tool => ({ params: { slug: tool.slug } }))) satisfies GetStaticPaths;

function shortName(name: string): string {
  // Manifest short_name should stay compact for the home-screen label.
  if (name.length <= 16) return name;
  const firstWord = name.split(/\s+/)[0];
  return firstWord.length <= 16 ? firstWord : name.slice(0, 15);
}

export const GET: APIRoute = ({ params }) => {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) return new Response('Not found', { status: 404 });

  const category = categories.find(c => c.slug === tool.categorySlug);
  const segment = category?.segment ?? tool.categorySlug;
  const toolUrl = withBase(`/tool/${segment}/${tool.slug}/`);
  const iconUrl = withBase(`/icons/tool/${tool.slug}.svg`);
  const { accent, background } = iconColors(tool);

  const manifest = {
    id: toolUrl,
    name: `${tool.name} — ToyTools`,
    short_name: shortName(tool.name),
    description: tool.description,
    start_url: toolUrl,
    scope: toolUrl,
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    lang: 'en',
    dir: 'ltr',
    theme_color: accent,
    background_color: background,
    categories: category ? [category.name] : [],
    icons: [
      { src: iconUrl, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: iconUrl, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
