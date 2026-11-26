import type { APIRoute, GetStaticPaths } from 'astro';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { iconColors } from '@lib/icons/tool-icon';
import { withBase, toolPath } from '@lib/paths';
import { LOCALIZED_LOCALES, isLocaleCode } from '@data/locales';
import { getLocalizedToolPack, localizeTool } from '@lib/i18n/registry';
import { localizeCategory } from '@data/i18n/index';

export const getStaticPaths = (() => {
  const paths: { params: { lang: string; slug: string } }[] = [];
  for (const lang of LOCALIZED_LOCALES) {
    for (const tool of tools) {
      if (getLocalizedToolPack(tool.slug, lang)) {
        paths.push({ params: { lang, slug: tool.slug } });
      }
    }
  }
  return paths;
}) satisfies GetStaticPaths;

function shortName(name: string): string {
  if (name.length <= 16) return name;
  const firstWord = name.split(/\s+/)[0];
  return firstWord.length <= 16 ? firstWord : name.slice(0, 15);
}

export const GET: APIRoute = ({ params }) => {
  const lang = isLocaleCode(params.lang) ? params.lang : 'en';
  const rawTool = tools.find(t => t.slug === params.slug);
  if (!rawTool) return new Response('Not found', { status: 404 });

  const tool = localizeTool(rawTool, lang);
  const rawCat = categories.find(c => c.slug === tool.categorySlug);
  const category = rawCat ? localizeCategory(rawCat, lang) : undefined;
  const segment = rawCat?.segment ?? tool.categorySlug;
  const toolUrl = toolPath({ slug: tool.slug, segment }, lang);
  const svgUrl = withBase(`/icons/tool/${tool.slug}.svg`);
  const png = (size: number) => withBase(`/icons/tool/${tool.slug}-${size}.png`);
  const { accent, background } = iconColors(tool);

  const manifest = {
    id: toolUrl,
    name: `${tool.name} - ToyTools`,
    short_name: shortName(tool.name),
    description: tool.description,
    start_url: toolUrl,
    scope: toolUrl,
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    lang,
    dir: 'ltr',
    theme_color: accent,
    background_color: background,
    categories: category ? [category.name] : [],
    icons: [
      { src: png(192), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: png(512), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: png(512), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: svgUrl, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
