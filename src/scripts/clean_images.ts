import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDefaultImages() {
  console.log("--- Nettoyage des images par défaut ---");
  
  // On récupère les posts qui ont l'URL par défaut
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, specialty_tag, main_image')
    .ilike('main_image', '%1505751172107%');

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  console.log(`${posts.length} articles trouvés avec l'image par défaut.`);

  for (const post of posts) {
    const newKeywords = `${post.specialty_tag || 'health'}, africa, hospital`;
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ main_image: newKeywords })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Erreur lors de la mise à jour du post ${post.id}:`, updateError.message);
    } else {
      console.log(`[OK] Post "${post.title}" mis à jour avec : ${newKeywords}`);
    }
  }
}

cleanDefaultImages();
