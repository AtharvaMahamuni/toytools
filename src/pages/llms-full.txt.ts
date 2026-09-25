import type { APIRoute } from 'astro';
import { renderLlmsFull } from '@lib/llms/render';

const SITE_FALLBACK = 'https://toytoolsapp.com';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  return new Response(renderLlmsFull(base), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
