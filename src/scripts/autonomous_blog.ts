import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function getTrendingTopics(): Promise<string[]> {
  console.log("--- Recherche de tendances santé au Cameroun via Gemini ---");
  const prompt = `
    Tu es un expert en actualité santé au Cameroun. 
    Génère 5 titres d'articles de blog percutants basés sur l'actualité santé réelle ou les préoccupations saisonnières au Cameroun en ce moment (avril 2026).
    
    CRITÈRES :
    - Doit parler de villes camerounaises (Douala, Yaoundé, Bafoussam, Garoua, etc.).
    - Sujets variés : nutrition locale, épidémies, réformes de santé (CSU), bien-être, maternité.
    - Ton journalistique et informatif.
    
    SORTIE (JSON UNIQUEMENT) :
    ["Titre 1", "Titre 2", "Titre 3", "Titre 4", "Titre 5"]
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(`Gemini API Response empty: ${JSON.stringify(data)}`);
    }
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Erreur lors de la récupération des tendances :", err);
    return [
      "Nutrition à Douala : Les bienfaits du ndolè sur votre santé",
      "CSU au Cameroun : Comment s'inscrire en 2026",
      "Maternité : Les meilleures cliniques d'Akwa pour accoucher",
      "Paludisme : Les gestes barrières à Yaoundé pendant la saison des pluies",
      "Sport à Douala : Où courir en toute sécurité ?"
    ];
  }
}

async function generateArticle(topic: string, publishInHours: number) {
  console.log(`--- Génération de l'article : ${topic} ---`);
  
  const prompt = `
    Tu es un rédacteur médical expert pour SantéDouala.cm, spécialisé dans la santé au Cameroun.
    
    SUJET : ${topic}
    
    CONSIGNES DE CAMEROUNISATION :
    1. Ancrage local : Mentionne obligatoirement des quartiers de Douala (Akwa, Bonapriso, Deïdo, Logpom, Bépanda, etc.) ou Yaoundé (Bastos, Mvan, Essos).
    2. Alimentation : Cite des aliments locaux (plantain, manioc, ndolè, huile de palme, kossam, safou, etc.).
    3. Économie : Mentionne les coûts en FCFA et la réalité des soins de proximité.
    4. Ton : Bienveillant, informatif, accessible (pas trop clinique).
    5. VISUELS : Inclus dans le 'content' HTML au moins une balise <img> avec une URL de type : https://loremflickr.com/800/450/health,africa,<keyword> où <keyword> est un mot-clé pertinent en anglais.
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
    {
      "title": "Titre SEO captivant",
      "excerpt": "Résumé court (150-200 caractères)",
      "content": "Contenu HTML complet (h2, h3, p, strong, ul, li, img). Minimum 800 mots.",
      "specialty_tag": "Spécialité médicale",
      "meta_description": "SEO description",
      "image_keyword": "3-4 mots-clés anglais pour l'image"
    }
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(`Gemini API Response empty: ${JSON.stringify(data)}`);
    }
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articleData = JSON.parse(text);
    const slug = slugify(articleData.title);
    const published_at = new Date();
    published_at.setHours(published_at.getHours() + publishInHours);

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
        published_at: published_at.toISOString()
      });

    if (error) throw error;
    console.log(`[+] Publié : ${articleData.title}`);
  } catch (err) {
    console.error(`Échec pour : ${topic}`, err);
  }
}

async function runAuto() {
  const topics = await getTrendingTopics();
  for (let i = 0; i < topics.length; i++) {
    await generateArticle(topics[i], i * 2);
  }
}

runAuto();
