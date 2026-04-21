import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateDescription(clinic: any) {
  const prompt = `
    Tu es un expert en santé au Cameroun. Rédige une description professionnelle, détaillée et rassurante pour l'établissement de santé de référence suivant à Douala.
    
    NOM : ${clinic.nom}
    
    CONSIGNES :
    1. Longueur : Environ 150 à 200 mots.
    2. Expertise : Mentionne que c'est l'un des établissements les plus connus et respectés de Douala.
    3. Services : Cite des spécialités probables pour ce type d'établissement (ex: Urgences 24h/24, Maternité, Chirurgie, Imagerie médicale, etc.).
    4. Localisation : Précise son importance pour les habitants de Douala et sa réputation nationale.
    5. Ton : Institutionnel, expert, rassurant.
    6. Vocabulaire : "Plateau technique de pointe", "soins spécialisés", "excellence médicale", "prise en charge multidisciplinaire".
    
    Réponds UNIQUEMENT avec le texte de la description. Pas d'introduction ni de conclusion.
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
    if (!response.ok) {
      return null;
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.error(`Failed for ${clinic.nom}:`, err);
    return null;
  }
}

async function enrichTop10() {
  const priorityKeywords = ['Général', 'Laquintinie', 'Toguem', 'Boum', 'Poitiers', 'Muna', 'Bel\'Air', 'Aéroport', 'Bonanjo'];
  
  const { data: clinics, error } = await supabase
    .from('clinics_enriched')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  const targetClinics = clinics.filter(c => 
    priorityKeywords.some(k => c.nom.toLowerCase().includes(k.toLowerCase()))
  );

  console.log(`Found ${targetClinics.length} priority clinics to process.`);

  for (const clinic of targetClinics) {
    console.log(`Enriching ${clinic.nom}...`);
    const description = await generateDescription(clinic);
    
    if (description) {
      const { error: updateError } = await supabase
        .from('clinics_enriched')
        .update({ description_custom: description })
        .eq('id', clinic.id);

      if (updateError) {
        console.error(`Update failed for ${clinic.nom}:`, updateError.message);
      } else {
        console.log(`[+] Successfully enriched ${clinic.nom}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("✅ Priority enrichment complete!");
}

enrichTop10();
