import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const topic = "Budget Santé 2026 : Ce que les 391 milliards de FCFA de l'État changent pour la CSU à Bépanda et Akwa";

function slugify(text: string) {
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

async function generateArticle() {
  console.log(`--- Retrying article: ${topic} ---`);
  
  const prompt = `
    Tu es un rédacteur médical expert pour SantéDouala.cm, spécialisé dans la santé au Cameroun.
    
    SUJET : ${topic}
    
    CONSIGNES DE CAMEROUNISATION :
    1. Ancrage local : Mentionne obligatoirement des quartiers de Douala (Akwa, Bonapriso, Deïdo, Logpom, Bépanda, etc.).
    2. Alimentation : Cite des aliments locaux si pertinent (plantain, manioc, ndolè, huile de palme, kossam, safou, etc.).
    3. Économie : Mentionne les coûts en FCFA et la réalité des soins de proximité.
    4. Ton : Bienveillant, informatif, accessible (pas trop clinique).
    5. VISUELS : Inclus dans le 'content' HTML au moins une balise <img> avec une URL de type : https://loremflickr.com/800/450/health,africa,money. Ajoute une légende sous l'image avec <figcaption>.
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
    {
      "title": "Titre SEO captivant",
      "excerpt": "Résumé court (150-200 caractères)",
      "content": "Contenu HTML complet (h2, h3, p, strong, ul, li, img). Minimum 700 mots.",
      "specialty_tag": "Spécialité médicale",
      "meta_description": "SEO description",
      "image_keyword": "african doctor, money, hospital"
    }
    
    Réponds UNIQUEMENT avec le JSON brut. Évite les caractères spéciaux non échappés dans les chaînes.
  `;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articleData = JSON.parse(text);
    const slug = slugify(articleData.title);

    const { error } = await supabase
      .from('blog_posts')
      .insert({
        title: articleData.title,
        slug: slug,
        content: articleData.content,
        excerpt: articleData.excerpt,
        specialty_tag: articleData.specialty_tag,
        meta_description: articleData.meta_description,
        main_image: articleData.image_keyword,
        published_at: new Date().toISOString()
      });

    if (error) throw error;
    console.log(`[+] Article published: ${articleData.title}`);
  } catch (err) {
    console.error(`Retry failed:`, err);
  }
}

generateArticle();
