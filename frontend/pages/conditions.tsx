import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Conditions() {
  return (
    <>
      <Head>
        <title>Conditions d'utilisation - Bookinails</title>
        <meta name="description" content="Conditions générales d'utilisation de la plateforme Bookinails." />
      </Head>

      <Header />

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Conditions générales d'utilisation
            </h1>
            
            <p className="text-gray-600 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Objet</h2>
            <p className="text-gray-600 mb-6">
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme Bookinails, 
              service de réservation en ligne de prestations de manucure et de soins des ongles.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Accès au service</h2>
            <p className="text-gray-600 mb-6">
              L'accès à Bookinails est gratuit pour les utilisateurs. Seule la réservation de prestations peut entraîner 
              des frais selon les tarifs des salons partenaires.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Réservations</h2>
            <p className="text-gray-600 mb-6">
              Les réservations effectuées via Bookinails sont soumises aux conditions particulières de chaque salon partenaire. 
              L'utilisateur s'engage à respecter les créneaux réservés et les conditions d'annulation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Responsabilité</h2>
            <p className="text-gray-600 mb-6">
              Bookinails agit en qualité d'intermédiaire entre les utilisateurs et les salons partenaires. 
              La responsabilité concernant la qualité des prestations incombe aux salons partenaires.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Données personnelles</h2>
            <p className="text-gray-600 mb-6">
              Vos données personnelles sont traitées conformément à notre politique de confidentialité. 
              Elles sont nécessaires au fonctionnement du service et ne sont pas cédées à des tiers sans votre consentement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Contact</h2>
            <p className="text-gray-600 mb-6">
              Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à : 
              <a href="mailto:legal@bookinails.fr" className="text-primary-600 hover:text-primary-700 ml-1">
                legal@bookinails.fr
              </a>
            </p>
          </div>

          <div className="text-center mt-16">
            <Link href="/" className="btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
