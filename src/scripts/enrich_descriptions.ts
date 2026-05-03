import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchPlaceDetails(placeId: string) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleApiKey,
      'X-Goog-FieldMask': 'id,internationalPhoneNumber,formattedAddress,rating,userRatingCount,regularOpeningHours,websiteUri'
    }
  });

  if (!response.ok) return null;
  return await response.json();
}

async function generateDescription(clinic: any, details: any, model = 'gemini-2.5-flash') {
  const prompt = `
    Tu es un expert en santé au Cameroun. Rédige une description professionnelle, détaillée et rassurante pour l'établissement de santé suivant à Douala.
    
    NOM : ${clinic.nom}
    ADRESSE : ${details?.formattedAddress || 'Douala, Cameroun'}
    TÉLÉPHONE : ${details?.internationalPhoneNumber || 'Non communiqué'}
    SPÉCIALITÉS : ${clinic.specialites?.join(', ') || 'Médecine générale'}
    NOTE : ${details?.rating ? `${details.rating}/5 (${details.userRatingCount} avis)` : 'N/A'}
    
    CONSIGNES :
    1. Longueur : Environ 150 à 200 mots.
    2. Localisation : Mentionne l'adresse précise et le quartier s'il est connu (${clinic.quartier || 'Douala'}).
    3. Ton : Professionnel, médical, mais accueillant.
    4. Contenu : Intègre l'adresse et le téléphone naturellement dans le texte. Parle de l'engagement envers la qualité des soins.
    5. CAMEROUNISATION : Utilise un vocabulaire adapté (ex: "plateau technique", "prise en charge", "santé de proximité").
    6. STRUCTURE : Utilise des paragraphes clairs.
    
    Réponds UNIQUEMENT avec le texte de la description.
  `;

  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiKey}`;

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
      if (response.status === 429) return "RATE_LIMIT";
      console.error(`Gemini API Error (${model}):`, data);
      throw new Error(JSON.stringify(data));
    }

    if (!data.candidates || data.candidates.length === 0) return null;
    return data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.error(`Failed for ${clinic.nom} with ${model}:`, err);
    return null;
  }
}

async function enrichAllClinics() {
  const { data: clinics, error } = await supabase
    .from('clinics_enriched')
    .select('*')
    .order('nom', { ascending: true });

  if (error) {
    console.error('Error fetching clinics:', error);
    return;
  }

  const missing = clinics.filter(c => !c.description_custom || c.description_custom.length < 200);
  console.log(`Remaining clinics to enrich: ${missing.length} out of ${clinics.length}.`);

  for (let i = 0; i < missing.length; i++) {
    const clinic = missing[i];

    console.log(`[${i+1}/${missing.length}] Processing ${clinic.nom}...`);

    const details = await fetchPlaceDetails(clinic.place_id);
    let description = await generateDescription(clinic, details);

    if (description === "RATE_LIMIT") {
      console.log("⚠️ Rate limit reached for gemini-2.5-flash. Trying fallback gemini-2.0-flash...");
      description = await generateDescription(clinic, details, 'gemini-2.0-flash');
      
      if (description === "RATE_LIMIT") {
        console.log("⚠️ Rate limit reached for gemini-2.0-flash. Trying fallback gemini-2.0-flash-lite...");
        description = await generateDescription(clinic, details, 'gemini-2.0-flash-lite');
        
        if (description === "RATE_LIMIT") {
          console.log("⚠️ Rate limit reached for all models. Waiting 90 seconds...");
          await new Promise(resolve => setTimeout(resolve, 90000));
          description = await generateDescription(clinic, details, 'gemini-2.0-flash-lite');
        }
      }
    }

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

    // Safety delay
    await new Promise(resolve => setTimeout(resolve, 35000));
  }
  
  console.log("✅ Final enrichment process finished!");
}

enrichAllClinics();
