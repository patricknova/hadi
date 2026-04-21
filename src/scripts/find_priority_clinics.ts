import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const keywords = ['Général', 'Laquintinie', 'Toguem', 'Boum', 'Poitiers', 'Muna', 'Bel\'Air', 'Aéroport', 'Bonanjo'];

async function find() {
  const { data, error } = await supabase
    .from('clinics_enriched')
    .select('id, nom, slug, description_custom');

  if (error) {
    console.error(error);
    return;
  }

  const matched = data.filter(c => 
    keywords.some(k => c.nom.toLowerCase().includes(k.toLowerCase()))
  );

  console.log(JSON.stringify(matched, null, 2));
}

find();
