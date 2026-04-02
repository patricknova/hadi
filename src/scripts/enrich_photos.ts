import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function enrichPhotos() {
  console.log('--- Start Enriching Photos ---');
  
  // Fetch all clinics without photos
  const { data: clinics, error: fetchError } = await supabase
    .from('clinics_enriched')
    .select('id, place_id, nom')
    .or('google_photos.is.null,google_photos.eq.{}');

  if (fetchError) {
    console.error('Error fetching clinics:', fetchError);
    return;
  }

  console.log(`Found ${clinics?.length} clinics to enrich.`);

  if (!clinics) return;

  for (const clinic of clinics) {
    console.log(`Enriching ${clinic.nom}...`);
    
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${clinic.place_id}`, {
        headers: {
          'X-Goog-Api-Key': googleApiKey,
          'X-Goog-FieldMask': 'photos'
        }
      });

      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        const photoNames = data.photos.map((p: any) => p.name);
        
        const { error: updateError } = await supabase
          .from('clinics_enriched')
          .update({ google_photos: photoNames })
          .eq('id', clinic.id);

        if (updateError) {
          console.error(`Error updating ${clinic.nom}:`, updateError.message);
        } else {
          console.log(`[+] Updated ${clinic.nom} with ${photoNames.length} photos.`);
        }
      } else {
        console.log(`[-] No photos found for ${clinic.nom}.`);
        // Mark as empty to avoid re-fetching
        await supabase
          .from('clinics_enriched')
          .update({ google_photos: [] })
          .eq('id', clinic.id);
      }
    } catch (err) {
      console.error(`Failed to fetch photos for ${clinic.nom}:`, err);
    }
    
    // Tiny delay to respect rate limits if many
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('--- Enrichment Finished ---');
}

enrichPhotos();
