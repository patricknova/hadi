export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function getCanonicalURL(path: string) {
  const baseUrl = 'https://hadi-tau.vercel.app'; // Official domain
  const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
  return `${baseUrl}${cleanPath || '/'}`;
}
