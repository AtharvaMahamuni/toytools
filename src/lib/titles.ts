import { TITLE_SUFFIX } from '@config/site';

// Every title ends in the brand suffix from the site identity (src/config/site.ts), so the brand
// is spelled in one place. The text of every title is unchanged; titles.test.ts pins it.
const T = TITLE_SUFFIX;

export type PageType =
  | 'home' | 'tool' | 'guide' | 'faq' | 'category' | 'search' | 'architecture' | 'platform'
  | 'feedback' | 'privacy' | 'about' | 'changelog' | 'settings' | 'offline' | 'notFound';

export function generatePageTitle(type: PageType, name?: string): string {
  switch (type) {
    // Leads with what the site contains, not with adjectives about it. The previous
    // title ("ToyTools ● Lightweight, Private, Free") carried no word anyone types, so
    // the homepage could only ever match the brand, and "ToyTools" reads as toys until
    // something in the same line says otherwise. Trust claims belong in the description,
    // after a visitor knows what the thing is. Kept under 60 characters so Google does
    // not truncate it.
    case 'home':     return `Free Online Tools: Convert, Calculate, Encode${T}`;
    case 'tool':     return `${name}${T}`;
    case 'guide':    return `${name}${T} Guide`;
    case 'faq':      return `${name} FAQ${T}`;
    case 'category': return `${name}${T}`;
    case 'search':   return `Search${T}`;
    case 'architecture': return `Architecture${T}`;
    // The page a tool page's "Powered by ToyTools" signature leads to, so the title has to
    // answer the question that click asks rather than name a section of the site.
    case 'platform': return `The Platform Behind the Tools${T}`;
    // The page's H1 greets whoever is already here; this title has to answer the query that
    // brought them, so it names the two things people actually search for.
    case 'feedback': return `Suggest a Tool or Report an Issue${T}`;
    case 'privacy':  return `Privacy${T}`;
    case 'about':    return `About${T}`;
    case 'changelog': return `Changelog${T}`;
    case 'settings': return `Settings${T}`;
    case 'offline':  return `Offline${T}`;
    case 'notFound': return `Page Not Found${T}`;
  }
}
