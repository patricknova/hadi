import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const TOPICS = [
  "Saison des pluies à Douala : Comment protéger sa famille du paludisme et des maladies hydriques dans les quartiers de Bépanda et Logpom.",
  "Nutrition & Hypertension au Cameroun : Adapter nos plats traditionnels (réduction du sel/cube) pour une meilleure santé cardiaque à Douala.",
  "Maternité à Douala : L'importance du suivi prénatal et du choix de son plateau technique (Laquintinie, Hôpital Général).",
  "Santé des Yeux à Douala : L'impact de la poussière urbaine et des écrans, et où consulter pour éviter la fatigue oculaire.",
  "Urgences Médicales : Les bons réflexes et comment utiliser l'annuaire Hadi pour trouver la clinique la plus proche en cas de crise à Douala."
];

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

async function generateArticle(topic: string, index: number) {
  console.log(`--- Génération de l'article ${index+1}/5 : ${topic} ---`);
  
  const prompt = `
    Tu es un rédacteur médical expert pour le site Hadi (Hadi.cm), spécialisé dans la santé au Cameroun.
    
    SUJET : ${topic}
    
    CONSIGNES DE RÉDACTION :
    1. CAMEROUNISATION : Utilise un vocabulaire adapté (ex: "plateau technique", "santé de proximité", "prise en charge multidisciplinaire", "évacuation sanitaire"). 
    2. ANCRAGE LOCAL : Mentionne des quartiers de Douala (Akwa, Bonapriso, Deïdo, Logpom, Bépanda, etc.) et des réalités locales (embouteillages, saison des pluies, alimentation locale comme le ndolé, manioc, plantain).
    3. TON : Professionnel, médical, informatif mais accessible et rassurant.
    4. LONGUEUR : Minimum 600 mots.
    5. STRUCTURE : Utilise des balises HTML (h2, h3, p, strong, ul, li).
    6. IMAGE : Inclus une balise <figure> avec une image <img> de source https://loremflickr.com/800/450/health,africa,<keyword> où <keyword> est un mot-clé anglais pertinent. Ajoute un <figcaption> explicatif.
    
    SORTIE JSON SOUHAITÉE (UNIQUEMENT LE JSON) :
    {
      "title": "Un titre accrocheur pour le Cameroun",
      "excerpt": "Un résumé percutant de 160 caractères maximum",
      "content": "Le contenu HTML complet (h2, h3, p, ul, li, figure)",
      "specialty_tag": "La spécialité médicale (ex: Cardiologie, Pédiatrie, Ophtalmologie, etc.)",
      "meta_description": "Une méta-description pour le SEO local",
      "main_image": "Un mot-clé anglais pour l'image de couverture (ex: 'african doctor')"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const articleData = JSON.parse(text);
    const slug = slugify(articleData.title);
    
    const published_at = new Date();
    published_at.setHours(8 + (index * 2));

    const { error } = await supabase
      .from('blog_posts')
      .insert({
        title: articleData.title,
        slug: slug,
        content: articleData.content,
        excerpt: articleData.excerpt,
        specialty_tag: articleData.specialty_tag,
        meta_description: articleData.meta_description,
        main_image: articleData.main_image,
        published_at: published_at.toISOString()
      });

    if (error) {
      console.error(`Erreur Supabase pour "${articleData.title}":`, error.message);
    } else {
      console.log(`[+] Article publié avec succès : ${articleData.title}`);
    }
  } catch (err) {
    console.error(`Échec pour "${topic}":`, err);
  }
}

async function run() {
  for (let i = 0; i < TOPICS.length; i++) {
    await generateArticle(TOPICS[i], i);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log("✅ Batch du jour terminé !");
}

run();
