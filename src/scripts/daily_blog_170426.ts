
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    title: "Visite du Pape Léon XIV à Japoma : Urgences et Santé à Douala",
    slug: "visite-pape-leon-xiv-douala-sante-urgences",
    excerpt: "Plus de 120 000 fidèles attendus au stade Japoma ce 17 avril. HADI vous guide vers les points de secours et hôpitaux de référence.",
    content: `
      <h2>Dispositif Santé Spécial pour la Visite Papale</h2>
      <p>La ville de Douala vit un moment historique avec la visite du <strong>Pape Léon XIV</strong> ce 17 avril 2026. Avec plus de 120 000 personnes attendues au stade Japoma, le dispositif sanitaire est monté en puissance sous l'impulsion du MINSANTE.</p>
      
      <h3>Où se faire soigner en cas de malaise ?</h3>
      <p>Des postes de secours avancés ont été installés tout autour du complexe de Japoma. Pour des cas plus complexes, les hôpitaux de référence de Douala sont en alerte maximale :</p>
      <ul>
        <li><strong>L'Hôpital Général de Douala :</strong> Plateau technique renforcé pour les urgences vitales.</li>
        <li><strong>L'Hôpital Gynéco-Obstétrique :</strong> Prise en charge spécifique des femmes et enfants.</li>
      </ul>

      <h3>Conseils HADI pour les pèlerins</h3>
      <p>Face à la chaleur humide de Douala, l'hydratation est votre priorité. Utilisez l'application HADI pour localiser en temps réel la clinique la plus proche de votre position si vous vous sentez mal en quittant le stade. La plateforme répertorie les temps d'attente estimés pour vous orienter efficacement.</p>
    `,
    specialty_tag: "Actualité",
    main_image: "https://images.unsplash.com/photo-1548625361-195fe61688c1?q=80&w=1000&auto=format&fit=crop",
    meta_description: "Guide santé et urgences pour la visite du Pape Léon XIV à Douala (Stade Japoma) le 17 avril 2026.",
    published_at: "2026-04-17T08:00:00Z"
  },
  {
    title: "Vaccination Mpox à Douala : Les centres ouverts depuis le 10 avril",
    slug: "vaccination-mpox-douala-centres-agrees",
    excerpt: "La campagne contre la variole du singe s'intensifie dans le Littoral. Découvrez où vous faire vacciner gratuitement à Douala.",
    content: `
      <h2>Riposte Sanitaire : Le vaccin MVA-BN arrive à Douala</h2>
      <p>Depuis le 10 avril 2026, la région du Littoral a lancé officiellement sa campagne de vaccination ciblée contre le <strong>Mpox (Variole du singe)</strong>. Douala, étant un carrefour d'échanges, est au centre de cette stratégie de prévention.</p>
      
      <h3>Qui est concerné ?</h3>
      <p>La priorité est donnée aux populations à risque de 18 ans et plus dans les districts de santé les plus denses. La vaccination est volontaire et gratuite dans les centres agréés par l'Etat.</p>

      <h3>Trouver son Centre de Santé de Proximité (CSI)</h3>
      <p>Sur HADI, nous avons mis à jour la liste des <strong>Centres de Santé Intégrés (CSI)</strong> et hôpitaux de district à Douala 3ème, Douala 5ème et Logbaba qui administrent le vaccin. Ne cédez pas aux rumeurs : informez-vous via les canaux officiels et localisez le point de vaccination le plus proche via notre carte interactive.</p>
    `,
    specialty_tag: "Santé Publique",
    main_image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1000&auto=format&fit=crop",
    meta_description: "Centres de vaccination Mpox à Douala : où se faire vacciner contre la variole du singe au Cameroun.",
    published_at: "2026-04-17T09:30:00Z"
  },
  {
    title: "Plan Stratégique National de Santé Numérique : HADI en avance",
    slug: "plan-sante-numerique-cameroun-2026-2030-hadi",
    excerpt: "Le Cameroun investit 29 milliards FCFA dans la digitalisation de la santé. Décryptage d'une révolution déjà en marche avec HADI.",
    content: `
      <h2>Le Futur de l'Hôpital au Cameroun est Digital</h2>
      <p>Le Plan Stratégique National de Santé Numérique 2026-2030 vient d'être lancé. Avec un budget ambitieux de 29 milliards FCFA, l'objectif est clair : dématérialiser les dossiers patients et faciliter l'accès aux soins grâce aux nouvelles technologies.</p>
      
      <h3>Pourquoi HADI est votre meilleur allié ?</h3>
      <p>Alors que l'Etat structure sa transition, <strong>HADI (Hospital Agency for Digital Integration)</strong> offre déjà aux Camerounais les outils de demain :</p>
      <ul>
        <li><strong>Annuaire certifié :</strong> Plus besoin de parcourir la ville pour savoir si une clinique a un scanner fonctionnel.</li>
        <li><strong>Transparence :</strong> Consultez les avis des autres patients sur la qualité de l'accueil à Yaoundé ou Douala.</li>
        <li><strong>Prise de rendez-vous :</strong> Réduire les files d'attente interminables dans nos hôpitaux publics et privés.</li>
      </ul>
      <p>La digitalisation n'est plus une option, c'est une nécessité pour sauver des vies au pays.</p>
    `,
    specialty_tag: "Technologie",
    main_image: "https://images.unsplash.com/photo-1576091160550-2173dad9998e?q=80&w=1000&auto=format&fit=crop",
    meta_description: "Le Cameroun lance son Plan National de Santé Numérique 2026-2030. Comment HADI digitalise déjà vos soins.",
    published_at: "2026-04-17T11:00:00Z"
  },
  {
    title: "Grippe et Polio : Alerte double pour les parents de Yaoundé et Douala",
    slug: "grippe-polio-cameroun-avril-2026-vigilance-enfants",
    excerpt: "Hausse des cas de grippe (21%) et campagne Polio du 23 au 26 avril. Ce que vous devez savoir pour protéger vos enfants.",
    content: `
      <h2>Une Saison Épidémique Intense</h2>
      <p>Les services de pédiatrie de Yaoundé et Douala signalent une recrudescence de la <strong>grippe saisonnière</strong>. Avec un taux de positivité dépassant les 21%, il est crucial de protéger les plus jeunes, particulièrement avec les pluies actuelles.</p>
      
      <h3>Rappel Vaccination Polio : 23-26 Avril</h3>
      <p>Parallèlement, un tour national de vaccination contre la poliomyélite est programmé pour la fin du mois. Les enfants de 0 à 5 ans doivent recevoir leurs gouttes, que ce soit à domicile ou dans les centres de santé.</p>

      <h3>Les bons réflexes HADI</h3>
      <p>Si votre enfant présente une forte fièvre ou une fatigue inhabituelle, ne pratiquez pas l'automédication. Utilisez HADI pour identifier les <strong>cliniques pédiatriques</strong> ouvertes 24h/24 à proximité de chez vous. Un diagnostic rapide évite les complications pulmonaires fréquentes en cette période.</p>
    `,
    specialty_tag: "Santé Infantile",
    main_image: "https://images.unsplash.com/photo-1584820923420-2e16904d550f?q=80&w=1000&auto=format&fit=crop",
    meta_description: "Alerte épidémique au Cameroun : Grippe saisonnière et campagne de vaccination Polio en avril 2026.",
    published_at: "2026-04-17T14:00:00Z"
  },
  {
    title: "Choléra à Douala 3ème : Vigilance à Logbaba, Nyalla et PK10",
    slug: "alerte-cholera-douala-3eme-logbaba-nyalla",
    excerpt: "L'insalubrité urbaine favorise des foyers de choléra. Apprenez à identifier les symptômes et à trouver une prise en charge rapide.",
    content: `
      <h2>Alerte Sanitaire à Douala 3ème</h2>
      <p>Des cas de <strong>choléra</strong> ont été signalés dans certains quartiers de l'arrondissement de Douala 3ème. La promiscuité et les problèmes d'accès à l'eau potable dans des zones comme Logbaba, Nyalla ou PK10 augmentent les risques de propagation.</p>
      
      <h3>Les Symptômes qui ne trompent pas</h3>
      <p>Une diarrhée liquide abondante ("eau de riz") et des vomissements fréquents doivent vous alerter immédiatement. La déshydratation peut être fatale en quelques heures.</p>

      <h3>Où aller en urgence ?</h3>
      <p>HADI a listé les formations sanitaires de <strong>Douala 3ème</strong> équipées pour gérer les maladies hydriques. L'Hôpital de District de Logbaba reste le centre de référence principal. Pensez à vous laver les mains régulièrement au savon et à bouillir votre eau de consommation.</p>
    `,
    specialty_tag: "Prévention",
    main_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    meta_description: "Alerte Choléra à Douala 3ème : Conseils de prévention et centres de prise en charge à Logbaba et Nyalla.",
    published_at: "2026-04-17T16:00:00Z"
  }
];

async function insertArticles() {
  console.log("Démarrage de l'insertion des articles du 17/04/2026...");
  
  for (const article of articles) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert([article], { onConflict: 'slug' });

    if (error) {
      console.error(`Erreur pour l'article "${article.title}":`, error.message);
    } else {
      console.log(`Article inséré/mis à jour avec succès : ${article.title}`);
    }
  }
}

insertArticles();
