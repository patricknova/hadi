import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function probePhoneNumber() {
  const { data: clinic } = await supabase.from('clinics_enriched').select('id, nom').limit(1).single();
  if (!clinic) return;

  console.log(`Probing phone_number with ${clinic.nom}...`);
  const { error } = await supabase
    .from('clinics_enriched')
    .update({
      phone_number: 'TEST'
    } as any)
    .eq('id', clinic.id);

  if (error) {
    console.error('Probe failed:', error.message);
  } else {
    console.log("Verdict: phone_number EXISTS!");
  }
}

probePhoneNumber();
