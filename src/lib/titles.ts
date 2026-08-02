export type PageType =
  | 'home' | 'tool' | 'guide' | 'faq' | 'category' | 'language' | 'search' | 'architecture'
  | 'feedback' | 'privacy' | 'about' | 'changelog' | 'settings' | 'offline' | 'notFound';

export function generatePageTitle(type: PageType, name?: string): string {
  switch (type) {
    case 'home':     return 'ToyTools ● Lightweight, Private, Free';
    case 'tool':     return `${name} ● ToyTools`;
    case 'guide':    return `${name} ● ToyTools Guide`;
    case 'faq':      return `${name} FAQ ● ToyTools`;
    case 'category': return `${name} ● ToyTools`;
    case 'language': return `ToyTools ${name}`;
    case 'search':   return 'Search ● ToyTools';
    case 'architecture': return 'Architecture ● ToyTools';
    // The page's H1 greets whoever is already here; this title has to answer the query that
    // brought them, so it names the two things people actually search for.
    case 'feedback': return 'Suggest a Tool or Report an Issue ● ToyTools';
    case 'privacy':  return 'Privacy ● ToyTools';
    case 'about':    return 'About ● ToyTools';
    case 'changelog': return 'Changelog ● ToyTools';
    case 'settings': return 'Settings ● ToyTools';
    case 'offline':  return 'Offline ● ToyTools';
    case 'notFound': return 'Page Not Found ● ToyTools';
  }
}
