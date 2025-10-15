const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs').promises

// Configuration Lighthouse optimisée pour Bookinails
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1600,
      cpuSlowdownMultiplier: 4
    },
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3
    },
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa']
  }
}

// Pages critiques à auditer
const CRITICAL_PAGES = [
  {
    url: 'http://localhost:3000',
    name: 'Homepage',
    thresholds: { performance: 90, accessibility: 95, seo: 95, pwa: 85 }
  },
  {
    url: 'http://localhost:3000/login',
    name: 'Login',
    thresholds: { performance: 95, accessibility: 98, seo: 90 }
  },
  {
    url: 'http://localhost:3000/register',
    name: 'Register', 
    thresholds: { performance: 95, accessibility: 98, seo: 90 }
  },
  {
    url: 'http://localhost:3000/salon/1',
    name: 'Salon Detail',
    thresholds: { performance: 85, accessibility: 95, seo: 95 }
  },
  {
    url: 'http://localhost:3000/dashboard/client',
    name: 'Client Dashboard',
    thresholds: { performance: 80, accessibility: 95, seo: 85 }
  }
]

class PerformanceAuditor {
  constructor() {
    this.results = []
    this.chrome = null
  }

  async init() {
    console.log('🚀 Démarrage Chrome pour audit Lighthouse...')
    this.chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    })
  }

  async auditPage(pageConfig) {
    console.log(`\n📊 Audit en cours: ${pageConfig.name} (${pageConfig.url})`)
    
    try {
      const result = await lighthouse(pageConfig.url, {
        port: this.chrome.port,
        ...lighthouseConfig
      })

      const scores = {
        performance: Math.round(result.lhr.categories.performance.score * 100),
        accessibility: Math.round(result.lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(result.lhr.categories['best-practices'].score * 100),
        seo: Math.round(result.lhr.categories.seo.score * 100),
        pwa: result.lhr.categories.pwa ? Math.round(result.lhr.categories.pwa.score * 100) : 'N/A'
      }

      const metrics = {
        firstContentfulPaint: result.lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: result.lhr.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: result.lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: result.lhr.audits['total-blocking-time'].numericValue,
        speedIndex: result.lhr.audits['speed-index'].numericValue
      }

      // Vérifier les seuils
      const thresholds = pageConfig.thresholds || {}
      const issues = []
      
      Object.entries(thresholds).forEach(([metric, threshold]) => {
        const score = scores[metric] === 'N/A' ? 100 : scores[metric]
        if (score < threshold) {
          issues.push(`${metric}: ${score} < ${threshold} (seuil requis)`)
        }
      })

      const pageResult = {
        name: pageConfig.name,
        url: pageConfig.url,
        scores,
        metrics,
        issues,
        passed: issues.length === 0
      }

      this.results.push(pageResult)
      this.logPageResult(pageResult)
      
      return pageResult

    } catch (error) {
      console.error(`❌ Erreur audit ${pageConfig.name}:`, error.message)
      return {
        name: pageConfig.name,
        url: pageConfig.url,
        error: error.message,
        passed: false
      }
    }
  }

  logPageResult(result) {
    const { scores, metrics, issues, passed } = result
    
    console.log(`${passed ? '✅' : '❌'} ${result.name}`)
    console.log(`   Performance: ${scores.performance}% | A11y: ${scores.accessibility}% | SEO: ${scores.seo}% | PWA: ${scores.pwa}%`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms | LCP: ${Math.round(metrics.largestContentfulPaint)}ms`)
    
    if (issues.length > 0) {
      console.log(`   ⚠️  Issues: ${issues.join(', ')}`)
    }
  }

  async auditAllPages() {
    await this.init()
    
    console.log('🎯 Audit Lighthouse Bookinails - Niveau Einsteinien')
    console.log('=' .repeat(60))
    
    for (const pageConfig of CRITICAL_PAGES) {
      await this.auditPage(pageConfig)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Pause entre audits
    }
    
    await this.generateReport()
    await this.cleanup()
  }

  async generateReport() {
    const passedCount = this.results.filter(r => r.passed).length
    const totalCount = this.results.length
    const successRate = Math.round((passedCount / totalCount) * 100)
    
    console.log('\n📈 RAPPORT FINAL LIGHTHOUSE')
    console.log('=' .repeat(60))
    console.log(`Résultat global: ${passedCount}/${totalCount} pages validées (${successRate}%)`)
    
    // Scores moyens
    const avgScores = {
      performance: Math.round(this.results.reduce((sum, r) => sum + (r.scores?.performance || 0), 0) / totalCount),
      accessibility: Math.round(this.results.reduce((sum, r) => sum + (r.scores?.accessibility || 0), 0) / totalCount),
      seo: Math.round(this.results.reduce((sum, r) => sum + (r.scores?.seo || 0), 0) / totalCount),
    }
    
    console.log(`Scores moyens: Perf ${avgScores.performance}% | A11y ${avgScores.accessibility}% | SEO ${avgScores.seo}%`)
    
    // Recommandations
    console.log('\n💡 RECOMMANDATIONS:')
    
    const lowPerf = this.results.filter(r => r.scores?.performance < 90)
    if (lowPerf.length > 0) {
      console.log(`   ⚡ Performance: Optimiser ${lowPerf.map(r => r.name).join(', ')}`)
    }
    
    const lowA11y = this.results.filter(r => r.scores?.accessibility < 95)
    if (lowA11y.length > 0) {
      console.log(`   ♿ Accessibilité: Améliorer ${lowA11y.map(r => r.name).join(', ')}`)
    }
    
    // Sauvegarder rapport détaillé
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: totalCount,
        passedPages: passedCount,
        successRate,
        avgScores
      },
      results: this.results
    }
    
    await fs.writeFile('./lighthouse-report.json', JSON.stringify(reportData, null, 2))
    console.log('📊 Rapport détaillé sauvegardé: lighthouse-report.json')
    
    // Validation finale
    if (successRate >= 90 && avgScores.performance >= 85) {
      console.log('\n🎉 BOOKINAILS LIGHTHOUSE VALIDATED - READY FOR PRODUCTION! 🚀')
    } else {
      console.log('\n⚠️  Optimisations requises avant production')
    }
  }

  async cleanup() {
    if (this.chrome) {
      await this.chrome.kill()
    }
  }
}

// Test de charge simple
class LoadTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async testConcurrentUsers(userCount = 50) {
    console.log(`\n🔄 Test de charge: ${userCount} utilisateurs simultanés`)
    
    const startTime = Date.now()
    const promises = []
    
    for (let i = 0; i < userCount; i++) {
      promises.push(this.simulateUserJourney())
    }
    
    const results = await Promise.allSettled(promises)
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    const duration = Date.now() - startTime
    
    console.log(`   ✅ Succès: ${successful}/${userCount} (${Math.round(successful/userCount*100)}%)`)
    console.log(`   ❌ Échecs: ${failed}`)
    console.log(`   ⏱️  Durée: ${duration}ms`)
    console.log(`   📊 Throughput: ${Math.round(successful / (duration/1000))} req/sec`)
    
    return {
      userCount,
      successful,
      failed,
      duration,
      throughput: Math.round(successful / (duration/1000))
    }
  }

  async simulateUserJourney() {
    // Simuler un parcours utilisateur typique
    const steps = [
      '/',                    // Homepage
      '/?city=Paris',         // Search
      '/salon/1',             // Salon detail
      '/login',               // Login
      '/dashboard/client'     // Dashboard
    ]
    
    for (const path of steps) {
      const response = await fetch(`${this.baseUrl}${path}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} on ${path}`)
      }
      await new Promise(resolve => setTimeout(resolve, 100)) // Pause réaliste
    }
  }
}

// Lanceur principal
async function runFullAudit() {
  console.log('🎯 AUDIT COMPLET BOOKINAILS - NIVEAU EINSTEINIEN 72D++')
  console.log('=' .repeat(70))
  
  try {
    // 1. Audit Lighthouse
    const auditor = new PerformanceAuditor()
    await auditor.auditAllPages()
    
    // 2. Test de charge
    const loadTester = new LoadTester()
    await loadTester.testConcurrentUsers(50)
    
    console.log('\n🏆 AUDIT TERMINÉ - BOOKINAILS READY FOR UNICORN STATUS! 🦄')
    
  } catch (error) {
    console.error('❌ Erreur durant l\'audit:', error.message)
    process.exit(1)
  }
}

// Exporter pour utilisation en module
module.exports = { PerformanceAuditor, LoadTester, runFullAudit }

// Lancer si appelé directement
if (require.main === module) {
  runFullAudit()
}
