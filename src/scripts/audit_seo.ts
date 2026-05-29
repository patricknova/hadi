
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runDetailedAudit() {
  console.log("🚀 Lancement de l'Audit SEO détaillé pour HADI\n");

  // 1. Audit du Blog
  const { data: posts, error: postError } = await supabase
    .from('blog_posts')
    .select('title, content, slug, excerpt, main_image');
  
  if (postError) {
    console.error('Erreur blog:', postError);
  } else {
    console.log(`--- [BLOG] Analyse de ${posts.length} articles ---`);
    let thinBlog = 0;
    let duplicateTitles = new Set();
    const seenTitles = new Set();

    posts.forEach(post => {
      const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      if (words < 600) {
        console.log(`⚠️  Mince (${words} mots) : ${post.title} (/blog/${post.slug})`);
        thinBlog++;
      }
      if (seenTitles.has(post.title)) {
        duplicateTitles.add(post.title);
      }
      seenTitles.add(post.title);

      // Check image status
      if (!post.main_image || !post.main_image.startsWith('http')) {
        // console.log(`ℹ️  Image par mots-clés : ${post.title} (${post.main_image})`);
      }
    });

    if (duplicateTitles.size > 0) {
      console.log(`\n🔴 Doublons de titres détectés (${duplicateTitles.size}) :`);
      duplicateTitles.forEach(t => console.log(`   - ${t}`));
    }
    console.log(`\n📊 Résumé Blog : ${thinBlog}/${posts.length} articles trop courts.`);
  }

  // 2. Audit des Cliniques
  const { data: clinics, error: clinicError } = await supabase
    .from('clinics_enriched')
    .select('nom, description_custom, slug, quartier');

  if (clinicError) {
    console.error('Erreur cliniques:', clinicError);
  } else {
    console.log(`\n--- [CLINIQUES] Analyse de ${clinics.length} fiches ---`);
    let thinClinics = 0;
    const descriptions = new Map();
    let exactDuplicates = 0;

    clinics.forEach(clinic => {
      const desc = clinic.description_custom || "";
      const words = desc.split(/\s+/).length;
      
      if (words < 200) {
        console.log(`⚠️  Mince (${words} mots) : ${clinic.nom} (/clinique/${clinic.slug})`);
        thinClinics++;
      }

      if (descriptions.has(desc) && desc.length > 50) {
        exactDuplicates++;
        // console.log(`🔴 Description en double : ${clinic.nom} (identique à ${descriptions.get(desc)})`);
      }
      descriptions.set(desc, clinic.nom);
    });

    console.log(`\n📊 Résumé Cliniques : ${thinClinics}/${clinics.length} fiches trop courtes.`);
    if (exactDuplicates > 0) {
      console.log(`🔴 ${exactDuplicates} fiches ont des descriptions strictement identiques.`);
    }
  }

  // 3. Audit des Quartiers
  const { data: quartiersData } = await supabase.from('clinics_enriched').select('quartier');
  const uniqueQuartiers = [...new Set(quartiersData?.map(q => q.quartier).filter(Boolean))];
  console.log(`\n--- [QUARTIERS] ${uniqueQuartiers.length} zones identifiées ---`);
  console.log(`Quartiers : ${uniqueQuartiers.join(', ')}`);

  console.log("\n✅ Audit terminé.");
}

runDetailedAudit();
