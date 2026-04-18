import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TOPICS = [
  "Santé Numérique au Cameroun : Ce que le plan de 29 milliards (PSNSN) va changer pour vos consultations à Douala et Yaoundé",
  "70% des soins à votre charge ? Comment la CSU et les mutuelles de quartier tentent de soulager le porte-monnaie des Camerounais en 2026",
  "Football de quartier : Les nouveaux réflexes de secours après l'accord FECAFOOT-Croix-Rouge pour protéger nos '2-0' locaux",
  "Pénurie de médecins : Pourquoi la téléconsultation devient le nouveau 'médecin de famille' de Logpom à Bastos",
  "Grands rassemblements à Yaoundé : Guide de prévention et de premiers secours en vue de la visite papale d'avril 2026"
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

async function generateArticle(topic: string, publishInHours: number) {
  console.log(`--- Génération de l'article : ${topic} ---`);
  
  const prompt = `
    Tu es un rédacteur médical expert pour SantéDouala.cm, spécialisé dans la santé au Cameroun.
    
    SUJET : ${topic}
    
    CONSIGNES DE CAMEROUNISATION :
    1. Ancrage local : Mentionne obligatoirement des quartiers de Douala (Akwa, Bonapriso, Deïdo, Logpom, Bépanda, etc.) ou Yaoundé (Bastos, Mvan, Essos, Mvog-Ada).
    2. Alimentation : Cite des aliments locaux (plantain, manioc, ndolè, huile de palme, kossam, safou, etc.) si pertinent pour la santé.
    3. Économie : Mentionne les coûts en FCFA (ex: consultation à 5 000 ou 10 000 FCFA) et la réalité des soins de proximité.
    4. Références d'actualité : Mentionne le Plan Stratégique National de Santé Numérique (PSNSN 2026-2030) ou l'accord FECAFOOT-Croix-Rouge selon le sujet.
    5. Ton : Bienveillant, informatif, accessible (pas trop clinique).
    6. VISUELS : Inclus dans le 'content' HTML au moins une balise <img> avec une URL de type : https://loremflickr.com/800/450/health,africa,<keyword> où <keyword> est un mot-clé pertinent en anglais.
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
    {
      "title": "Titre SEO captivant",
      "excerpt": "Résumé court (150-200 caractères)",
      "content": "Contenu HTML complet (h2, h3, p, strong, ul, li, img). Minimum 850 mots.",
      "specialty_tag": "Spécialité médicale la plus proche",
      "meta_description": "SEO description optimisée",
      "image_keyword": "3-4 mots-clés anglais pour l'image"
    }
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
    console.log(`[+] Publié avec succès : ${articleData.title}`);
  } catch (err) {
    console.error(`Échec pour : ${topic}`, err);
  }
}

async function main() {
  console.log("Démarrage de la génération des 5 articles du jour (15/04/2026)...");
  for (let i = 0; i < TOPICS.length; i++) {
    await generateArticle(TOPICS[i], i * 2);
  }
  console.log("Terminé !");
}

main();
