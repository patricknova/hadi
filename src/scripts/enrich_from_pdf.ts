import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/clinique|hopital|centre medical|polyclinique|cma|medical clinic/g, "")
    .trim();
};

async function enrichFromPdf() {
  const rawData = fs.readFileSync('extracted_clinics.json', 'utf8');
  const pdfClinics = JSON.parse(rawData);

  const mappingData = fs.readFileSync('clinic_mapping.json', 'utf8');
  const nameMapping = JSON.parse(mappingData);

  const { data: dbClinics, error: fetchError } = await supabase
    .from('clinics_enriched')
    .select('*');

  if (fetchError) {
    console.error('Error fetching clinics from DB:', fetchError);
    return;
  }

  console.log(`Matching ${pdfClinics.length} PDF entries with ${dbClinics.length} DB entries using mapping...`);

  for (const pdfClinic of pdfClinics) {
    let match;
    const mappedName = nameMapping[pdfClinic.name];
    
    if (mappedName) {
      match = dbClinics.find(db => db.nom === mappedName);
    }

    if (!match) {
        const normPdfName = normalizeName(pdfClinic.name);
        match = dbClinics.find(db => {
          const normDbName = normalizeName(db.nom);
          return normDbName.includes(normPdfName) || normPdfName.includes(normDbName);
        });
    }

    if (match) {
      console.log(`[MATCH] ${pdfClinic.name} -> ${match.nom}`);
      
      const updates: any = {};
      
      // Update phone if missing
      if (pdfClinic.phone_number && (!match.phone_number || match.phone_number === 'TEST')) {
        updates.phone_number = pdfClinic.phone_number;
      }
      
      // Update address
      if (pdfClinic.address && !match.adresse) {
        updates.adresse = pdfClinic.address;
      }
      
      // Merge specialties
      const currentSpecs = match.specialites || [];
      const newSpecs = Array.from(new Set([...currentSpecs, ...pdfClinic.specialties]));
      if (newSpecs.length > currentSpecs.length) {
        updates.specialites = newSpecs;
      }
      
      // Append insurance to description if not already there
      let description = match.description_custom || "";
      const insuranceText = `\n\n**Assurances acceptées :** ${pdfClinic.insurance_partners.join(', ')}.`;
      if (pdfClinic.insurance_partners.length > 0 && !description.includes('Assurances acceptées')) {
        updates.description_custom = description + insuranceText;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('clinics_enriched')
          .update(updates)
          .eq('id', match.id);

        if (updateError) {
          console.error(`Error updating ${match.nom}:`, updateError.message);
        } else {
          console.log(`[+] Updated ${match.nom} with ${Object.keys(updates).join(', ')}`);
        }
      }
    } else {
      console.log(`[NO MATCH] ${pdfClinic.name}`);
    }
  }

  console.log('--- PDF Enrichment Finished ---');
}

enrichFromPdf();
