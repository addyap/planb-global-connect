import { LegalPageLayout } from "@/components/LegalPageLayout";
import { CONTACT } from "@/lib/contact";

const PolitiqueConfidentialite = () => {
  return (
    <LegalPageLayout
      seoTitle="Politique de confidentialité — Plan B Concept"
      seoDescription="Politique de confidentialité et traitement des données personnelles sur planb-concept.com."
      path="/politique-de-confidentialite"
      heading="Politique de confidentialité"
      lastUpdated="22/07/2026"
    >
      <p className="text-foreground/90 mb-10">
        Plan B Concept attache une grande importance à la protection des données personnelles de ses visiteurs et clients. La présente politique de confidentialité décrit la manière dont vos données sont collectées, utilisées et protégées dans le cadre de votre utilisation du site planb-concept.com, conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi française &quot;Informatique et Libertés&quot; du 6 janvier 1978 modifiée.
      </p>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Responsable du traitement</h2>
        <div className="text-foreground/90 space-y-2">
          <p>Le responsable du traitement des données est :</p>
          <p className="font-medium">Plan B Concept (SARL à associé unique)</p>
          <p>Gérant : Anthony Gratton</p>
          <p>Email : {CONTACT.email}</p>
          <p>Adresse : 139 Impasse des Liserons, 83600 Fréjus</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Données collectées</h2>
        <div className="text-foreground/90 space-y-4">
          <p>Le site planb-concept.com collecte les catégories de données suivantes :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Données de contact : lorsque vous remplissez le formulaire de contact ou le questionnaire en ligne (nom, prénom, adresse email, numéro de téléphone, informations relatives à votre projet).
            </li>
            <li>
              Données techniques de navigation : adresse IP et en-têtes HTTP (notamment <em>User-Agent</em>) transmis automatiquement à nos sous-traitants techniques lors du chargement des pages, de l&apos;envoi d&apos;un formulaire ou du chargement des polices de caractères. Voir la section « Destinataires des données » ci-dessous.
            </li>
          </ul>
          <p>Aucune donnée sensible (au sens de l&apos;article 9 du RGPD) n&apos;est collectée.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Finalités du traitement</h2>
        <div className="text-foreground/90 space-y-2">
          <p>Vos données personnelles sont utilisées exclusivement pour les finalités suivantes :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Répondre à vos demandes de contact et établir des devis</li>
            <li>Vous adresser des informations relatives à votre projet</li>
            <li>Assurer le bon fonctionnement, la sécurité et la disponibilité du site</li>
            <li>Respecter nos obligations légales et comptables</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Base légale du traitement</h2>
        <div className="text-foreground/90 space-y-2">
          <p>Le traitement de vos données repose sur :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Votre consentement (article 6.1.a du RGPD) pour les communications commerciales et les cookies non essentiels</li>
            <li>L&apos;exécution de mesures précontractuelles ou contractuelles (article 6.1.b du RGPD) pour les demandes de devis et la gestion de la relation client</li>
            <li>L&apos;intérêt légitime (article 6.1.f du RGPD) pour l&apos;amélioration du site et la prévention de la fraude</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Durée de conservation</h2>
        <ul className="list-disc pl-5 space-y-2 text-foreground/90">
          <li>Données de contact : conservées 3 ans à compter du dernier échange, puis archivées pendant la durée légale applicable.</li>
          <li>Journaux techniques (logs serveur, hébergeur et fonctions edge) : conservés 12 mois maximum.</li>
          <li>Données comptables : conservées 10 ans conformément à l&apos;article L.123-22 du Code de commerce.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Destinataires des données — Sous-traitants</h2>
        <div className="text-foreground/90 space-y-4">
          <p>
            Vos données ne sont communiquées qu&apos;aux personnes habilitées au sein de Plan B Concept et aux sous-traitants techniques strictement nécessaires au fonctionnement du site. Aucune donnée n&apos;est cédée, louée ou vendue à des tiers à des fins commerciales.
          </p>
          <p>Les sous-traitants actuellement utilisés sont les suivants :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Vercel Inc.</strong> (États-Unis) — hébergement du site et diffusion via CDN. Traite l&apos;adresse IP et les en-têtes HTTP des visiteurs (logs techniques, protection contre les abus).
            </li>
            <li>
              <strong>Supabase</strong> — base de données et fonctions serveur (<em>edge functions</em>), hébergée sur un projet propre à Plan B Concept. Stocke les données soumises via les formulaires de contact et de questionnaire (nom, email, téléphone, message, détails du projet, <em>user-agent</em>) et exécute la notification associée.
            </li>
            <li>
              <strong>Resend</strong> (États-Unis) — prestataire d&apos;envoi d&apos;email. Reçoit le contenu des notifications envoyées à Plan B Concept lorsqu&apos;un formulaire est soumis (nom, email, téléphone, message, détails du projet) afin d&apos;acheminer l&apos;email.
            </li>
          </ul>
          <p>
            Les polices de caractères affichées sur le site (Orbitron, Inter) sont auto-hébergées et servies depuis notre propre domaine ; aucune requête n&apos;est effectuée vers Google Fonts ou un autre tiers pour leur chargement.
          </p>
          <p>
            Certains de ces sous-traitants (Vercel, Supabase, Resend) sont susceptibles de traiter ou transférer des données en dehors de l&apos;Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par les clauses contractuelles types adoptées par la Commission européenne ou, le cas échéant, par le cadre de protection des données UE — États-Unis (<em>EU-U.S. Data Privacy Framework</em>).
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Vos droits</h2>
        <div className="text-foreground/90 space-y-4">
          <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Droit d&apos;accès (article 15)</li>
            <li>Droit de rectification (article 16)</li>
            <li>Droit à l&apos;effacement, dit « droit à l&apos;oubli » (article 17)</li>
            <li>Droit à la limitation du traitement (article 18)</li>
            <li>Droit à la portabilité (article 20)</li>
            <li>Droit d&apos;opposition (article 21)</li>
            <li>Droit de retirer votre consentement à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à {CONTACT.email} en précisant l&apos;objet de votre demande et en joignant une copie d&apos;une pièce d&apos;identité si nécessaire.
          </p>
          <p>
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés) : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              www.cnil.fr
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Cookies</h2>
        <div className="text-foreground/90 space-y-4">
          <p>Plan B Concept n&apos;utilise aucun cookie de traçage ou de publicité.</p>
          <p>
            Seul le stockage local (<em>localStorage</em>) de la bibliothèque i18next est utilisé, afin de mémoriser votre préférence de langue. Ce stockage est strictement nécessaire au fonctionnement du site et est exempté de recueil de consentement au titre des lignes directrices de la CNIL relatives aux cookies et traceurs.
          </p>
          <p>
            Vous pouvez à tout moment supprimer ces données locales en paramétrant votre navigateur.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Sécurité</h2>
        <p className="text-foreground/90">
          Plan B Concept met en œuvre les mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données personnelles (chiffrement HTTPS, hébergement sécurisé, accès restreint).
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default PolitiqueConfidentialite;
