import type { APIRoute } from 'astro';
import { aiJson, json } from '@lib/identity/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(json(aiJson(siteUrl(site).href)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
