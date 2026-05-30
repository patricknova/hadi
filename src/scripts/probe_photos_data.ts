import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function probePhotos() {
  const { data, error } = await supabase
    .from('clinics_enriched')
    .select('nom, google_photos')
    .not('google_photos', 'is', null)
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample photo data:');
  console.log(JSON.stringify(data, null, 2));
}

probePhotos();
