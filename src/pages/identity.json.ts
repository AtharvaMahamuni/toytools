import type { APIRoute } from 'astro';
import { identityJson, json } from '@lib/identity/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(json(identityJson(siteUrl(site).href)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
