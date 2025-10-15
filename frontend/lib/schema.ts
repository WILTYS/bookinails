import { Salon } from '@/types'

export function generateSalonSchema(salon: Salon) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": salon.name,
    "description": salon.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": salon.address,
      "addressLocality": salon.city,
      "addressCountry": "FR"
    },
    "telephone": salon.phone,
    "email": salon.email,
    "url": `https://bookinails.fr/salon/${salon.id}`,
    "image": salon.image_url || "https://bookinails.fr/default-salon.jpg",
    "priceRange": salon.price_range,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": salon.rating,
      "reviewCount": salon.total_reviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "openingHours": [
      "Mo-Su " + salon.open_time + "-" + salon.close_time
    ],
    "paymentAccepted": [
      "Cash", "Credit Card", "Debit Card"
    ],
    "currenciesAccepted": "EUR",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de manucure",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Manucure classique",
            "description": "Soin complet des ongles avec vernis"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Pose de gel",
            "description": "Application de gel UV pour des ongles durables"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Nail art",
            "description": "Décoration artistique des ongles"
          }
        }
      ]
    },
    "makesOffer": {
      "@type": "Offer",
      "availabilityStarts": new Date().toISOString(),
      "availabilityEnds": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bookinails",
    "description": "Plateforme de réservation en ligne pour salons de manucure et soins des ongles",
    "url": "https://bookinails.fr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bookinails.fr/?city={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bookinails",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bookinails.fr/logo.png"
      }
    }
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bookinails",
    "description": "La plateforme de référence pour la réservation de prestations de manucure en France",
    "url": "https://bookinails.fr",
    "logo": "https://bookinails.fr/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-1-23-45-67-89",
      "contactType": "customer service",
      "availableLanguage": ["French"]
    },
    "sameAs": [
      "https://www.facebook.com/bookinails",
      "https://www.instagram.com/bookinails",
      "https://twitter.com/bookinails"
    ],
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Équipe Bookinails"
      }
    ],
    "numberOfEmployees": "10-50",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Rue de la Beauté",
      "addressLocality": "Paris",
      "postalCode": "75001",
      "addressCountry": "FR"
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
