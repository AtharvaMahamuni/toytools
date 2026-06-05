export type PageType = 'home' | 'tool' | 'guide' | 'faq' | 'category' | 'language' | 'search' | 'notFound';

export function generatePageTitle(type: PageType, name?: string): string {
  switch (type) {
    case 'home':     return 'ToyTools ● Lightweight, Private, Free';
    case 'tool':     return `${name} ● ToyTools`;
    case 'guide':    return `${name} ● ToyTools Guide`;
    case 'faq':      return `${name} FAQ ● ToyTools`;
    case 'category': return `${name} ● ToyTools`;
    case 'language': return `ToyTools ${name}`;
    case 'search':   return 'Search ● ToyTools';
    case 'notFound': return 'Page Not Found ● ToyTools';
  }
}
