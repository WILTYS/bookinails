import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogType?: 'website' | 'article' | 'profile' | 'business.business'
  ogImage?: string
  noindex?: boolean
  schemaOrg?: any
  keywords?: string
}

export default function SEO({
  title = "Bookinails - Réservez votre manucure en ligne",
  description = "La plateforme de référence pour réserver votre salon de manucure. Trouvez les meilleurs professionnels près de chez vous, réservez en ligne et payez en sécurité.",
  canonical,
  ogType = "website",
  ogImage = "/og-image.jpg",
  noindex = false,
  schemaOrg,
  keywords = "manucure, ongle, salon, réservation, beauté, nail art, vernis, gel, french manucure"
}: SEOProps) {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bookinails.fr'
  const fullUrl = canonical || `${baseUrl}${router.asPath}`
  const fullTitle = title.includes('Bookinails') ? title : `${title} | Bookinails`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Bookinails" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@bookinails" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Additional SEO */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="theme-color" content="#ec4899" />
      <meta name="msapplication-TileColor" content="#ec4899" />

      {/* Structured Data */}
      {schemaOrg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      )}
    </Head>
  )
}
