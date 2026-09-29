import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderLlmsTxt } from '@lib/llms/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const categoryEntries = contentByType('category');
  const standalone = contentByType('page');
  const feedbackEntry = standalone.find(p => p.slug === 'feedback');
  const platformEntry = standalone.find(p => p.slug === 'platform');
  return new Response(renderLlmsTxt(categoryEntries, feedbackEntry, base, platformEntry), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
