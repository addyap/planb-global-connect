import { LegalPageLayout, LegalPlaceholder } from "@/components/LegalPageLayout";
import { CONTACT } from "@/lib/contact";

const MentionsLegales = () => {
  return (
    <LegalPageLayout
      seoTitle="Mentions légales — Plan B Concept"
      seoDescription="Mentions légales du site planb-concept.com, édité par Plan B Concept."
      path="/mentions-legales"
      heading="Mentions légales"
      lastUpdated="23/05/2026"
    >
      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Éditeur du site</h2>
        <div className="prose prose-sm max-w-none text-foreground/90 space-y-3">
          <p>Le site planb-concept.com est édité par :</p>
          <div className="space-y-2">
            <p className="font-medium">Plan B Concept</p>
            <p>Forme juridique : EURL (Entreprise Unipersonnelle à Responsabilité Limitée) en cours d&apos;immatriculation</p>
            <p>Capital social : <LegalPlaceholder>[À COMPLÉTER — montant du capital social en euros]</LegalPlaceholder></p>
            <p>Siège social : <LegalPlaceholder>[À COMPLÉTER — adresse complète du siège social]</LegalPlaceholder></p>
            <p>SIRET : <LegalPlaceholder>[À COMPLÉTER — numéro SIRET à 14 chiffres]</LegalPlaceholder></p>
            <p>RCS : <LegalPlaceholder>[À COMPLÉTER — ville d&apos;immatriculation et numéro RCS]</LegalPlaceholder></p>
            <p>Numéro de TVA intracommunautaire : <LegalPlaceholder>[À COMPLÉTER — si applicable, format FR + 11 chiffres]</LegalPlaceholder></p>
          </div>
          <div className="space-y-1 mt-4">
            <p>Gérant : Anthony Gratton</p>
            <p>Contact : {CONTACT.email}</p>
            <p>Téléphone : +33 6 15 19 81 15</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Directeur de la publication</h2>
        <p className="text-foreground/90">Anthony Gratton, en qualité de gérant.</p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Hébergeur</h2>
        <div className="text-foreground/90 space-y-1">
          <p>Le site est hébergé par :</p>
          <p className="font-medium">Vercel Inc.</p>
          <p>340 S Lemon Ave #4133</p>
          <p>Walnut, CA 91789</p>
          <p>USA</p>
          <p>
            Site web :{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              https://vercel.com
            </a>
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Propriété intellectuelle</h2>
        <div className="text-foreground/90 space-y-4">
          <p>
            L&apos;ensemble du contenu présent sur le site planb-concept.com (textes, images, photographies, logo, graphismes, structure du site) est la propriété exclusive de Plan B Concept ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale ou partielle, des éléments du site, par quelque procédé que ce soit, sans l&apos;autorisation préalable écrite de Plan B Concept, est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Limitation de responsabilité</h2>
        <div className="text-foreground/90 space-y-4">
          <p>
            Plan B Concept met tout en œuvre pour assurer l&apos;exactitude et la mise à jour des informations diffusées sur le site, mais ne peut garantir l&apos;absence d&apos;erreurs, d&apos;omissions, ou de retards de mise à jour. L&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
          </p>
          <p>
            Plan B Concept ne saurait être tenue responsable des dommages directs ou indirects résultant de l&apos;accès ou de l&apos;utilisation du site, y compris l&apos;inaccessibilité, les pertes de données, les détériorations, les destructions ou les virus pouvant affecter l&apos;équipement informatique de l&apos;utilisateur.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl text-primary mb-4">Droit applicable</h2>
        <p className="text-foreground/90">
          Les présentes mentions légales sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default MentionsLegales;
