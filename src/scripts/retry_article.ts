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

async function generateSingleArticle(topic: string) {
  console.log(`--- Retrying failed article: ${topic} ---`);
  
  const prompt = `
    Tu es un rédacteur médical expert pour SantéDouala.cm, spécialisé dans la santé au Cameroun.
    
    SUJET : ${topic}
    
    CONSIGNES DE CAMEROUNISATION :
    1. Ancrage local : Mentionne des quartiers de Douala (Akwa, Bonapriso, Deïdo, Logpom, etc.).
    2. Alimentation : Cite des aliments locaux (plantain, manioc, ndolè, huile de palme, kossam, etc.).
    3. Économie : Mentionne les coûts en FCFA et la réalité des soins de proximité.
    4. Ton : Bienveillant, informatif, accessible (pas trop clinique).
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
    {
      "title": "Titre SEO captivant",
      "excerpt": "Résumé court pour la liste du blog (150 caractères)",
      "content": "Contenu HTML complet (utilisant h2, h3, p, strong, ul, li). Minimum 600 mots.",
      "specialty_tag": "Endocrinologie",
      "meta_description": "Description pour Google"
    }

    Réponds UNIQUEMENT avec le JSON brut.
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
    
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${JSON.stringify(data)}`);
    }

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
        published_at: new Date().toISOString()
      });

    if (error) {
      console.error(`Error saving article:`, error.message);
    } else {
      console.log(`[+] Article successfully published: ${articleData.title}`);
    }
  } catch (err) {
    console.error(`Failed to generate article:`, err);
  }
}

generateSingleArticle("Diabète et plantain : équilibrer son alimentation au Cameroun");
