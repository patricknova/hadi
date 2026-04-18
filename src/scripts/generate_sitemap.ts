
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://hadi.cm';

async function generateSitemap() {
  console.log("Génération du sitemap.xml pour HADI...");

  const staticPages = [
    '',
    '/blog',
    '/quartiers',
    '/contact',
    '/404'
  ];

  // 1. Récupérer les cliniques
  const { data: clinics } = await supabase.from('clinics_enriched').select('slug');
  const clinicPages = clinics?.map(c => `/clinique/${c.slug}`) || [];

  // 2. Récupérer les quartiers (uniques depuis clinics_enriched)
  const { data: quartiersData } = await supabase.from('clinics_enriched').select('quartier');
  const uniqueQuartiers = [...new Set(quartiersData?.map(q => q.quartier).filter(Boolean))];
  const quartierPages = uniqueQuartiers.map(q => `/quartier/${q?.toLowerCase().replace(/\s+/g, '-')}`);

  // 3. Récupérer les articles de blog
  const { data: posts } = await supabase.from('blog_posts').select('slug');
  const blogPages = posts?.map(p => `/blog/${p.slug}`) || [];

  const allPages = [...staticPages, ...clinicPages, ...quartierPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : (page.startsWith('/clinique') ? '0.8' : '0.5')}</priority>
  </url>`).join('')}
</urlset>`;

  const outputPath = resolve('public/sitemap.xml');
  writeFileSync(outputPath, sitemap);
  console.log(`Sitemap généré avec succès dans ${outputPath} (${allPages.length} URLs)`);
}

generateSitemap();
