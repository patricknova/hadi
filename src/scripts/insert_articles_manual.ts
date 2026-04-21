import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    title: "La révolution numérique à Douala : Le Plan PSNSN 2026 transforme Laquintinie et HGOPED",
    slug: "revolution-numerique-douala-psnsn-2026",
    excerpt: "Découvrez comment la digitalisation des dossiers médicaux réduit l'attente à Akwa et améliore les soins de proximité à Douala.",
    content: `
      <h2>Le virage numérique de la santé au Cameroun</h2>
      <p>À Douala, l'époque des dossiers papier jaunis et perdus dans les archives de l'Hôpital Laquintinie à <strong>Akwa</strong> touche à sa fin. Le Plan Stratégique National de Santé Numérique (PSNSN) 2026-2030 commence à porter ses fruits, avec une accélération notable de la digitalisation des données patient.</p>
      <figure>
        <img src="https://loremflickr.com/800/450/health,africa,technology" alt="Technologie médicale en Afrique">
        <figcaption>L'usage des tablettes numériques se généralise dans les grands centres hospitaliers de Douala.</figcaption>
      </figure>
      <h3>Moins d'attente à HGOPED et Laquintinie</h3>
      <p>Pour un patient venant de <strong>Logpom</strong> ou de <strong>Bonabéri</strong>, l'accès aux soins est désormais plus fluide. À l'Hôpital Gynéco-Obstétrique et Pédiatrique de Douala (HGOPED), le dossier médical partagé permet aux spécialistes de consulter instantanément l'historique d'un enfant, évitant ainsi des examens redondants qui coûtent souvent entre 15 000 et 45 000 FCFA aux familles.</p>
      <p>Cette transition numérique ne se limite pas aux grands établissements. Les cliniques de proximité à <strong>Deïdo</strong> et <strong>Bépanda</strong> commencent également à adopter des solutions légères pour la gestion des rendez-vous via WhatsApp ou des applications locales dédiées.</p>
      <h3>L'impact sur le panier de la ménagère</h3>
      <p>La digitalisation permet une meilleure traçabilité des médicaments. Fini les achats en double par manque de coordination. Un patient peut désormais suivre son traitement avec une précision accrue, économisant ainsi de précieux <strong>FCFA</strong> pour d'autres besoins essentiels comme le <strong>manioc</strong> ou le <strong>plantain</strong> au marché.</p>
      <ul>
        <li>Réduction du temps d'attente de 40% à l'accueil.</li>
        <li>Sécurisation des données personnelles de santé.</li>
        <li>Amélioration de la coordination entre médecins de différents quartiers.</li>
      </ul>
      <p>En conclusion, la route vers 2030 s'annonce prometteuse pour la santé numérique au Cameroun. Les efforts conjugués de l'État et du secteur privé font de Douala un hub technologique médical en Afrique Centrale.</p>
    `,
    specialty_tag: "Généraliste",
    meta_description: "Impact du Plan PSNSN 2026 sur la digitalisation des hôpitaux à Douala (Laquintinie, HGOPED).",
    main_image: "african doctor digital tablet, hospital technology",
    published_at: new Date().toISOString()
  },
  {
    title: "Prévention du Choléra et de la Polio à Douala : Les bons réflexes après les grandes pluies",
    slug: "prevention-cholera-polio-douala-pluies",
    excerpt: "Avec le retour des pluies dans le Littoral, protégez votre famille contre le choléra et la polio à Deïdo et Bépanda.",
    content: `
      <h2>Alerte saisonnière : La vigilance est de mise</h2>
      <p>Le ciel de Douala s'est ouvert, et avec les fortes précipitations à <strong>Deïdo</strong> et <strong>Bépanda</strong>, le risque de maladies hydriques augmente considérablement. Le choléra et la polio restent des menaces sérieuses contre lesquelles nous devons nous prémunir collectivement.</p>
      <figure>
        <img src="https://loremflickr.com/800/450/health,africa,water" alt="Eau potable et hygiène">
        <figcaption>L'accès à l'eau potable est crucial pour prévenir les épidémies après les inondations urbaines.</figcaption>
      </figure>
      <h3>L'hygiène, une barrière infranchissable</h3>
      <p>Le lavage des mains avec de l'eau coulante et du savon reste le geste le plus efficace. Pour les familles résidant dans les zones inondables de <strong>Logbaba</strong> ou <strong>Ndogpassi</strong>, il est impératif de bouillir l'eau de puits avant toute consommation ou utilisation culinaire pour préparer le <strong>ndolé</strong> ou le <strong>koki</strong>.</p>
      <p>Un litre d'eau de Javel coûte moins de 1 000 FCFA et peut sauver des vies en désinfectant les latrines et les surfaces de cuisine. Ne négligez jamais ces petits investissements de prévention.</p>
      <h3>Vaccination : Le bouclier contre la Polio</h3>
      <p>La polio ne doit pas revenir. Les centres de santé d'<strong>Akwa</strong> et les équipes mobiles de vaccination parcourent les quartiers pour s'assurer qu'aucun enfant ne manque sa dose. La vaccination est gratuite dans tous les centres publics de santé du Cameroun.</p>
      <ul>
        <li>Lavez les fruits et légumes achetés au marché avec de l'eau chlorée.</li>
        <li>Maintenez les caniveaux propres devant vos maisons pour éviter les eaux stagnantes.</li>
        <li>Signalez tout cas de diarrhée suspecte au centre de santé le plus proche.</li>
      </ul>
      <p>En restant vigilants, nous protégeons non seulement notre famille mais toute la communauté de Douala. La santé commence par la propreté.</p>
    `,
    specialty_tag: "Pédiatrie",
    meta_description: "Conseils de prévention contre le choléra et la polio à Douala après la saison des pluies.",
    main_image: "hygiene washing hands africa, child vaccination",
    published_at: new Date(Date.now() + 4 * 3600000).toISOString()
  },
  {
    title: "Hypertension et Ndolé : Comment savourer nos plats locaux sans risquer sa tension",
    slug: "hypertension-ndole-alimentation-locale-douala",
    excerpt: "Apprenez à adapter vos recettes de ndolé et de safou pour protéger votre cœur tout en restant fidèle aux saveurs de Douala.",
    content: `
      <h2>La santé dans l'assiette au Cameroun</h2>
      <p>L'hypertension artérielle est le tueur silencieux qui frappe de nombreux habitants de <strong>Bonapriso</strong> et <strong>Akwa</strong>. Souvent, nous pensons devoir abandonner nos plats préférés pour rester en bonne santé. Mais la clé réside dans l'adaptation.</p>
      <figure>
        <img src="https://loremflickr.com/800/450/health,africa,food" alt="Cuisine camerounaise saine">
        <figcaption>Les légumes verts comme le ndolé sont excellents pour la santé s'ils sont préparés avec modération en sel et huile.</figcaption>
      </figure>
      <h3>Le Ndolé : Roi de la table, mais avec modération</h3>
      <p>Le <strong>ndolé</strong>, riche en fer et en fibres, est une base excellente. Cependant, l'excès de sel gemme (kang) et d'huile de palme raffinée peut faire grimper votre tension artérielle. Pour les résidents de <strong>Logpom</strong> qui fréquentent les circuits de santé, les médecins conseillent de réduire le sel et de privilégier les arachides fraîches moins grillées.</p>
      <p>Le <strong>safou</strong>, dégusté avec du <strong>manioc</strong>, est également un trésor nutritionnel. Riche en potassium, il aide à réguler la tension, à condition de ne pas le surcharger de sel à la cuisson.</p>
      <h3>Petit budget, grand impact</h3>
      <p>Un bilan de santé de base pour l'hypertension coûte environ 10 000 à 20 000 FCFA dans les cliniques de <strong>Bépanda</strong>. C'est un petit prix à payer pour éviter des complications graves comme les AVC. Remplacez le bouillon cube par des épices naturelles comme le poivre noir de Penja ou l'ail pour donner du goût à vos plats.</p>
      <ul>
        <li>Privilégiez les cuissons à la vapeur ou à l'eau.</li>
        <li>Augmentez votre consommation de fruits locaux comme la papaye ou l'ananas.</li>
        <li>Marchez au moins 30 minutes par jour dans les quartiers calmes de Douala.</li>
      </ul>
      <p>Bien manger, c'est vivre mieux. Nos traditions culinaires sont une force, apprenons à les sublimer pour notre santé.</p>
    `,
    specialty_tag: "Cardiologie",
    meta_description: "Guide pour manger sainement au Cameroun : adapter le ndolé et le safou contre l'hypertension.",
    main_image: "african food healthy, blood pressure monitor",
    published_at: new Date(Date.now() + 8 * 3600000).toISOString()
  },
  {
    title: "Calendrier de Vaccination 2026 au Cameroun : Ce que chaque parent de Douala doit savoir",
    slug: "calendrier-vaccination-2026-cameroun-douala",
    excerpt: "Tout savoir sur les nouvelles mises à jour du calendrier vaccinal pour protéger vos enfants à Bonabéri et Akwa.",
    content: `
      <h2>Protéger l'avenir de nos enfants</h2>
      <p>La vaccination reste le moyen le plus sûr de garantir une croissance saine à nos petits Camerounais. En 2026, le calendrier vaccinal national a été optimisé pour inclure de nouvelles protections. Que vous soyez à <strong>Bonabéri</strong> ou à <strong>Akwa</strong>, voici ce qu'il faut retenir.</p>
      <figure>
        <img src="https://loremflickr.com/800/450/health,africa,baby" alt="Bébé recevant un vaccin au Cameroun">
        <figcaption>Le carnet de vaccination est le passeport de santé de votre enfant dès sa naissance.</figcaption>
      </figure>
      <h3>Les rendez-vous incontournables</h3>
      <p>Dès la naissance à l'Hôpital de District de <strong>Deïdo</strong> ou dans les cliniques privées de <strong>Bonapriso</strong>, le BCG et le VPO sont administrés. Les rappels à 6, 10 et 14 semaines sont cruciaux. Ne manquez pas ces dates, car un retard peut fragiliser le système immunitaire de l'enfant.</p>
      <p>La nouveauté de 2026 inclut une meilleure couverture contre les méningites et les pneumonies. Le coût de ces vaccins est entièrement pris en charge par l'État du Cameroun, vous n'avez aucun <strong>FCFA</strong> à débourser dans le secteur public.</p>
      <h3>L'importance du carnet de santé</h3>
      <p>Conservez précieusement le carnet de santé de votre enfant. C'est l'outil qui permet au pédiatre de <strong>Logpom</strong> ou de <strong>Bépanda</strong> de suivre l'évolution de la croissance. Un enfant bien vacciné, c'est un enfant qui peut manger son <strong>kossam</strong> et son <strong>plantain</strong> en toute sérénité.</p>
      <ul>
        <li>Respectez scrupuleusement les dates de rendez-vous.</li>
        <li>N'ayez pas peur des légères fièvres post-vaccinales, elles sont normales.</li>
        <li>Demandez conseil à votre infirmière sur les soins de base après le vaccin.</li>
      </ul>
      <p>La santé de nos enfants est la richesse de notre pays. Faisons de la vaccination une priorité absolue dans chaque foyer de Douala.</p>
    `,
    specialty_tag: "Pédiatrie",
    meta_description: "Guide complet du calendrier de vaccination 2026 pour les parents à Douala, Cameroun.",
    main_image: "african baby clinic, nurse vaccinating child",
    published_at: new Date(Date.now() + 12 * 3600000).toISOString()
  },
  {
    title: "Stress urbain et Fitness Émotionnel : Pourquoi Bonapriso gagne face au bruit d'Akwa",
    slug: "stress-urbain-fitness-emotionnel-douala",
    excerpt: "Gérer le stress à Douala : l'importance du calme et de l'exercice physique pour les résidents du Littoral.",
    content: `
      <h2>Vivre sereinement dans la métropole économique</h2>
      <p>Douala ne dort jamais, et pour ceux qui travaillent à <strong>Akwa</strong>, le stress lié au bruit, aux embouteillages et à la chaleur peut devenir accablant. Le concept de 'fitness émotionnel' gagne du terrain pour aider les citadins à garder l'équilibre.</p>
      <figure>
        <img src="https://loremflickr.com/800/450/health,africa,meditation" alt="Méditation et calme en ville">
        <figcaption>Prendre quelques minutes de calme chaque jour réduit drastiquement le cortisol, l'hormone du stress.</figcaption>
      </figure>
      <h3>La marche thérapeutique à Bonapriso</h3>
      <p>Contrairement au tumulte de <strong>Bépanda</strong> ou des marchés d'<strong>Akwa</strong>, le quartier de <strong>Bonapriso</strong> offre des zones plus arborées et calmes, idéales pour la marche matinale ou en soirée. Marcher 30 minutes aide à vider l'esprit et à renforcer le cœur.</p>
      <p>Si vous résidez à <strong>Logpom</strong>, profitez des zones moins denses pour faire vos exercices. Le sport ne coûte pas de <strong>FCFA</strong>, il nécessite juste de la volonté et une bonne paire de chaussures.</p>
      <h3>Se ressourcer avec les produits du terroir</h3>
      <p>Le stress se combat aussi dans l'assiette. Remplacez les boissons gazeuses par du <strong>jus de foléré</strong> naturel ou de la <strong>papaye</strong> fraîche. Ces aliments riches en antioxydants aident votre corps à mieux gérer les agressions extérieures.</p>
      <ul>
        <li>Pratiquez la respiration profonde pendant 5 minutes lors des embouteillages.</li>
        <li>Éteignez les écrans une heure avant de dormir pour un meilleur repos.</li>
        <li>Établissez une routine de marche, même courte, trois fois par semaine.</li>
      </ul>
      <p>Le bien-être est un choix quotidien. À Douala, plus qu'ailleurs, prendre soin de son mental est essentiel pour réussir sa vie professionnelle et personnelle.</p>
    `,
    specialty_tag: "Psychologie",
    meta_description: "Conseils pour gérer le stress urbain à Douala via le fitness émotionnel et la marche à Bonapriso.",
    main_image: "african man walking park, urban stress relief",
    published_at: new Date(Date.now() + 16 * 3600000).toISOString()
  }
];

async function insertArticles() {
  console.log("Insertion manuelle des 5 articles de blog...");
  
  for (const article of articles) {
    const { error } = await supabase
      .from('blog_posts')
      .insert(article);

    if (error) {
      console.error(`Erreur pour "${article.title}":`, error.message);
    } else {
      console.log(`[+] Article inséré : ${article.title}`);
    }
  }
  
  console.log("Terminé !");
}

insertArticles();
