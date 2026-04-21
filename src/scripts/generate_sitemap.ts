
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://hadi-tau.vercel.app';

async function generateSitemap() {
  console.log("Génération du sitemap-index.xml et sitemap-0.xml pour HADI...");

  const staticPages = [
    '',
    '/blog',
    '/quartiers',
    '/contact'
  ];

  // 1. Récupérer les cliniques
  const { data: clinics } = await supabase.from('clinics_enriched').select('slug');
  const clinicPages = clinics?.map(c => `/clinique/${c.slug}`) || [];

  // 2. Récupérer les quartiers
  const { data: quartiersData } = await supabase.from('clinics_enriched').select('quartier');
  const uniqueQuartiers = [...new Set(quartiersData?.map(q => q.quartier).filter(Boolean))];
  const quartierPages = uniqueQuartiers.map(q => `/quartier/${q?.toLowerCase().replace(/\s+/g, '-')}`);

  // 3. Récupérer les articles de blog
  const { data: posts } = await supabase.from('blog_posts').select('slug');
  const blogPages = posts?.map(p => `/blog/${p.slug}`) || [];

  const allPages = [...staticPages, ...clinicPages, ...quartierPages, ...blogPages];
  const today = new Date().toISOString().split('T')[0];

  // Générer le sitemap de contenu (sitemap-0.xml)
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => {
    const encodedPath = page === '' ? '/' : page.split('/').map(part => encodeURIComponent(part)).join('/');
    const fullUrl = `${BASE_URL}${encodedPath.startsWith('/') ? '' : '/'}${encodedPath}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : (page.startsWith('/clinique') ? '0.8' : '0.5')}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  // Générer l'index (sitemap-index.xml)
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-0.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Sauvegarder les fichiers
  writeFileSync(resolve('public/sitemap-0.xml'), sitemapContent.trim());
  writeFileSync(resolve('public/sitemap-index.xml'), sitemapIndex.trim());
  
  // On garde aussi sitemap.xml pour compatibilité si besoin, mais on le fait pointer sur l'index
  writeFileSync(resolve('public/sitemap.xml'), sitemapContent.trim());

  console.log(`Sitemaps générés avec succès (${allPages.length} URLs).`);
  console.log(`- Index: ${BASE_URL}/sitemap-index.xml`);
  console.log(`- Contenu: ${BASE_URL}/sitemap-0.xml`);
}

generateSitemap();
