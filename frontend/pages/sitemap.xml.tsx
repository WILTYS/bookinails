import { GetServerSideProps } from 'next'

// Pages statiques de base
const STATIC_PAGES = [
  '',
  '/login',
  '/register', 
  '/comment-ca-marche',
  '/support',
  '/support-pro',
  '/conditions'
]

// Villes principales (à étendre selon votre couverture)
const MAIN_CITIES = [
  'paris',
  'lyon', 
  'marseille',
  'toulouse',
  'nice',
  'nantes',
  'montpellier',
  'strasbourg',
  'bordeaux',
  'lille'
]

function generateSiteMap(salons: any[], cities: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bookinails.fr'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${STATIC_PAGES.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
  
  ${cities.map(city => `
  <url>
    <loc>${baseUrl}/?city=${encodeURIComponent(city)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}
  
  ${salons.map(salon => `
  <url>
    <loc>${baseUrl}/salon/${salon.id}</loc>
    <lastmod>${new Date(salon.updated_at || salon.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Récupérer les salons depuis l'API (ou BDD)
  let salons = []
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${apiUrl}/api/salons`)
    if (response.ok) {
      salons = await response.json()
    }
  } catch (error) {
    console.error('Error fetching salons for sitemap:', error)
    // Mock data si erreur
    salons = [
      { id: 1, created_at: new Date().toISOString() },
      { id: 2, created_at: new Date().toISOString() }
    ]
  }

  // Générer le sitemap
  const sitemap = generateSiteMap(salons, MAIN_CITIES)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap
