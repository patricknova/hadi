import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

// Use Service Role Key if available for storage uploads
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function migratePhotos() {
  console.log('--- Start Migrating Photos to Supabase Storage ---');

  const { data: clinics, error: fetchError } = await supabase
    .from('clinics_enriched')
    .select('id, place_id, nom, slug, google_photos, photos_custom')
    .not('place_id', 'is', null);

  if (fetchError) {
    console.error('Error fetching clinics:', fetchError);
    return;
  }

  console.log(`Found ${clinics?.length} clinics to process.`);

  for (const clinic of clinics!) {
    // Skip if already migrated or no photos
    if (clinic.photos_custom && clinic.photos_custom.length > 0) {
      console.log(`[SKIP] ${clinic.nom} already has custom photos.`);
      continue;
    }

    console.log(`Processing ${clinic.nom}...`);

    try {
      // 1. Get fresh photo names from Google
      const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${clinic.place_id}`, {
        headers: {
          'X-Goog-Api-Key': googleApiKey,
          'X-Goog-FieldMask': 'photos'
        }
      });
      const detailsData = await detailsResponse.json();

      if (!detailsData.photos || detailsData.photos.length === 0) {
        console.log(`[-] No photos found for ${clinic.nom}.`);
        continue;
      }

      const uploadedPaths: string[] = [];
      
      // Limit to 3 photos per clinic to save space/time
      const photosToMigrate = detailsData.photos.slice(0, 3);

      for (let i = 0; i < photosToMigrate.length; i++) {
        const photo = photosToMigrate[i];
        const photoName = photo.name;
        
        // 2. Download from Google
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${googleApiKey}&maxHeightPx=1000`;
        const imageResponse = await fetch(photoUrl);
        
        if (!imageResponse.ok) {
          console.error(`Failed to download photo ${i} for ${clinic.nom}`);
          continue;
        }

        const buffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const fileExt = contentType.split('/')[1] || 'jpg';
        const fileName = `${clinic.slug}-${i}.${fileExt}`;
        const filePath = `clinics/${fileName}`;

        // 3. Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('clinic-photos')
          .upload(filePath, buffer, {
            contentType,
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${clinic.nom} (photo ${i}):`, uploadError.message);
        } else {
          // Get Public URL
          const { data: publicUrlData } = supabase.storage
            .from('clinic-photos')
            .getPublicUrl(filePath);
          
          uploadedPaths.push(publicUrlData.publicUrl);
          console.log(`  [+] Uploaded photo ${i} for ${clinic.nom}`);
        }
      }

      if (uploadedPaths.length > 0) {
        // 4. Update Database
        const { error: updateError } = await supabase
          .from('clinics_enriched')
          .update({ photos_custom: uploadedPaths })
          .eq('id', clinic.id);

        if (updateError) {
          console.error(`Database update failed for ${clinic.nom}:`, updateError.message);
        } else {
          console.log(`[SUCCESS] ${clinic.nom} updated with ${uploadedPaths.length} photos.`);
        }
      }

    } catch (err) {
      console.error(`Error processing ${clinic.nom}:`, err);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('--- Migration Finished ---');
}

migratePhotos();
