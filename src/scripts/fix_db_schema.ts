import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixClinicColumns() {
  console.log("--- Attempting to add missing columns to clinics_enriched ---");
  const queries = [
    "ALTER TABLE clinics_enriched ADD COLUMN IF NOT EXISTS phone_number TEXT;",
    "ALTER TABLE clinics_enriched ADD COLUMN IF NOT EXISTS adresse TEXT;",
    "ALTER TABLE clinics_enriched ADD COLUMN IF NOT EXISTS horaires TEXT;",
    "ALTER TABLE clinics_enriched ADD COLUMN IF NOT EXISTS google_maps_url TEXT;",
    "ALTER TABLE clinics_enriched ADD COLUMN IF NOT EXISTS assurances TEXT[] DEFAULT '{}';"
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('execute_sql', { query_text: query });
    if (error) {
      console.error(`Failed to execute: ${query}`, error.message);
    } else {
      console.log(`[+] Success: ${query}`);
    }
  }
  console.log("--- Finished fixing schema ---");
}

fixClinicColumns();
