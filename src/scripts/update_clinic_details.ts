import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchPlaceDetails(placeId: string) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleApiKey,
      'X-Goog-FieldMask': 'id,internationalPhoneNumber,formattedAddress,rating,userRatingCount,regularOpeningHours,googleMapsUri'
    }
  });

  if (!response.ok) return null;
  return await response.json();
}

async function updateAllClinicDetails() {
  const { data: clinics, error } = await supabase
    .from('clinics_enriched')
    .select('id, place_id, nom');

  if (error) {
    console.error('Error fetching clinics:', error);
    return;
  }

  console.log(`Updating details for ${clinics.length} clinics...`);

  for (const clinic of clinics) {
    if (!clinic.place_id) continue;
    
    console.log(`Fetching details for ${clinic.nom}...`);
    const details = await fetchPlaceDetails(clinic.place_id);
    
    if (details) {
      const updateData: any = {
        rating: details.rating,
        user_rating_count: details.userRatingCount,
        phone_number: details.internationalPhoneNumber,
        adresse: details.formattedAddress,
        google_maps_url: details.googleMapsUri
      };

      if (details.regularOpeningHours?.weekdayDescriptions) {
        updateData.horaires = details.regularOpeningHours.weekdayDescriptions.join('\n');
      }

      const { error: updateError } = await supabase
        .from('clinics_enriched')
        .update(updateData)
        .eq('id', clinic.id);

      if (updateError) {
        console.error(`Update failed for ${clinic.nom}:`, updateError.message);
      } else {
        console.log(`[+] Updated: ${clinic.nom}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  console.log("✅ All clinics updated!");
}

updateAllClinicDetails();
