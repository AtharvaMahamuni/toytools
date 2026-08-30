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
    case 'home':     return 'Free Online Tools: Convert, Calculate, Encode ● ToyTools';
    case 'tool':     return `${name} ● ToyTools`;
    case 'guide':    return `${name} ● ToyTools Guide`;
    case 'faq':      return `${name} FAQ ● ToyTools`;
    case 'category': return `${name} ● ToyTools`;
    case 'search':   return 'Search ● ToyTools';
    case 'architecture': return 'Architecture ● ToyTools';
    // The page a tool page's "Powered by ToyTools" signature leads to, so the title has to
    // answer the question that click asks rather than name a section of the site.
    case 'platform': return 'The Platform Behind the Tools ● ToyTools';
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
