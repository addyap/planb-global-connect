import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

const CGU = () => {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title="Conditions Générales d'Utilisation — Plan B Concept"
        description="Conditions Générales d'Utilisation du site planb-concept.com."
        path="/cgu"
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="pt-28 md:pt-36">
        <div className="container max-w-3xl mx-auto py-16 px-6">
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Dernière mise à jour : 23/05/2026
          </p>

          <p className="text-foreground/90 mb-10">
            Les présentes Conditions Générales d&apos;Utilisation (« CGU ») régissent l&apos;accès et l&apos;utilisation du site planb-concept.com, édité par Plan B Concept. Toute utilisation du site implique l&apos;acceptation pleine et entière des présentes CGU.
          </p>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Objet du site</h2>
            <div className="text-foreground/90 space-y-4">
              <p>
                Le site planb-concept.com est un site institutionnel présentant les services de project management et de conseil en construction proposés par Plan B Concept sur la Côte d&apos;Azur (Var 83 et Alpes-Maritimes 06). Le site permet également la prise de contact via un formulaire dédié et un questionnaire de qualification de projet.
              </p>
              <p>
                Le site n&apos;est pas un site marchand : aucune transaction en ligne n&apos;y est effectuée. Toute prestation fait l&apos;objet d&apos;un devis et d&apos;un contrat distincts.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Accès au site</h2>
            <div className="text-foreground/90 space-y-4">
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès à Internet. Les frais d&apos;accès et d&apos;utilisation du réseau de télécommunications restent à la charge de l&apos;utilisateur.
              </p>
              <p>
                Plan B Concept se réserve le droit, sans préavis ni indemnité, de fermer temporairement ou définitivement le site ou l&apos;accès à un ou plusieurs services, pour effectuer une mise à jour, des modifications ou tout changement relatif au fonctionnement du site.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Comportement de l&apos;utilisateur</h2>
            <div className="text-foreground/90 space-y-4">
              <p>
                L&apos;utilisateur s&apos;engage à utiliser le site conformément à sa destination et à respecter les lois et règlements en vigueur. Il s&apos;interdit notamment :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>De porter atteinte aux droits de propriété intellectuelle de Plan B Concept ou de tiers</li>
                <li>De tenter d&apos;accéder de manière non autorisée à des espaces réservés du site</li>
                <li>De diffuser des contenus illicites, diffamatoires, injurieux, ou contraires à l&apos;ordre public via les formulaires du site</li>
                <li>D&apos;utiliser le site à des fins de prospection commerciale non sollicitée</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Propriété intellectuelle</h2>
            <p className="text-foreground/90">
              Voir la section correspondante des{" "}
              <Link to="/mentions-legales" className="text-accent hover:underline">
                Mentions légales
              </Link>
              . L&apos;ensemble des éléments du site est protégé par le droit d&apos;auteur français et international.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Liens hypertextes</h2>
            <div className="text-foreground/90 space-y-4">
              <p>
                Le site peut contenir des liens vers des sites tiers. Plan B Concept n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
              <p>
                La création de liens hypertextes pointant vers le site planb-concept.com est autorisée à condition que ces liens ne portent pas atteinte à l&apos;image de Plan B Concept et qu&apos;ils signalent clairement la nature du lien.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Responsabilité</h2>
            <div className="text-foreground/90 space-y-4">
              <p>
                Plan B Concept s&apos;efforce de fournir sur le site des informations aussi précises que possible. Toutefois, elle ne saurait être tenue responsable des omissions, des inexactitudes, ou des carences dans la mise à jour des informations, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
              </p>
              <p>
                Les informations indiquées sur le site sont données à titre indicatif et sont susceptibles d&apos;évoluer. Elles ne sauraient engager la responsabilité de Plan B Concept en l&apos;absence d&apos;un devis ou d&apos;un contrat signé.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Données personnelles</h2>
            <p className="text-foreground/90">
              Le traitement des données personnelles collectées via le site est détaillé dans la{" "}
              <Link to="/politique-de-confidentialite" className="text-accent hover:underline">
                Politique de confidentialité
              </Link>
              , accessible à l&apos;adresse : /politique-de-confidentialite
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Modification des CGU</h2>
            <p className="text-foreground/90">
              Plan B Concept se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. L&apos;utilisateur est invité à consulter régulièrement la dernière version en vigueur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl text-primary mb-4">Droit applicable et juridiction compétente</h2>
            <p className="text-foreground/90">
              Les présentes CGU sont soumises au droit français. En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des CGU, et à défaut de résolution amiable, les tribunaux compétents du ressort du siège social de Plan B Concept seront seuls compétents.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGU;
