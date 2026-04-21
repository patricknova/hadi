import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const keywordMapping: Record<string, string[]> = {
  'Gynécologie': ['Gyneco', 'Gynéco', 'Maternité', 'Obstétri', 'Fécondation', 'Fertilité'],
  'Pédiatrie': ['Pédia', 'Enfant', 'Child', 'Pediatric'],
  'Cardiologie': ['Cardio', 'Heart', 'Cœur', 'Coeur', 'Tension', 'Hypertension'],
  'Ophtalmologie': ['Ophtalmo', 'Eye', 'Yeux', 'Vision', 'Optique'],
  'Dentiste': ['Dentiste', 'Dentaire', 'Dental', 'Odontostomatologie'],
  'Psychologie': ['Psy', 'Mental', 'Stress', 'Fitness Émotionnel'],
  'Radiologie': ['Radiologie', 'Imagerie', 'Scanner', 'IRM', 'Échographie', 'Echographie'],
  'Chirurgie': ['Chirurgie', 'Surgical', 'Opération'],
  'Médecine Générale': ['Générale', 'General', 'Polyclinic', 'Polyclinique', 'Hôpital de District', 'District Hospital']
};

async function tagByKeywords() {
  console.log('--- Classification des cliniques par mots-clés ---');
  
  const { data: clinics, error } = await supabase
    .from('clinics_enriched')
    .select('id, nom, specialites');

  if (error || !clinics) {
    console.error('Erreur:', error);
    return;
  }

  for (const clinic of clinics) {
    const medicalSpecialties: string[] = [];
    const name = clinic.nom.toLowerCase();

    for (const [specialty, keywords] of Object.entries(keywordMapping)) {
      if (keywords.some(k => name.includes(k.toLowerCase()))) {
        medicalSpecialties.push(specialty);
      }
    }

    if (medicalSpecialties.length > 0) {
      // Merge with existing Google types
      const updatedSpecialties = [...new Set([...medicalSpecialties, ...clinic.specialites])];

      const { error: updateError } = await supabase
        .from('clinics_enriched')
        .update({ specialites: updatedSpecialties })
        .eq('id', clinic.id);

      if (updateError) {
        console.error(`Erreur pour ${clinic.nom}:`, updateError.message);
      } else {
        console.log(`[OK] ${clinic.nom} -> ${medicalSpecialties.join(', ')}`);
      }
    } else {
        // Default if no match
        const updatedSpecialties = [...new Set(['Médecine Générale', ...clinic.specialites])];
        await supabase
            .from('clinics_enriched')
            .update({ specialites: updatedSpecialties })
            .eq('id', clinic.id);
        console.log(`[DEFAULT] ${clinic.nom} -> Médecine Générale`);
    }
  }

  console.log('--- Classification terminée ---');
}

tagByKeywords();
