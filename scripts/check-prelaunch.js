#!/usr/bin/env node

/**
 * 🚀 BOOKINAILS PRE-LAUNCH CHECK 72D++
 * Vérification complète avant mise en production
 */

const fs = require('fs').promises
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

class PreLaunchChecker {
  constructor() {
    this.checks = []
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      score: 0
    }
  }

  async runAllChecks() {
    console.log('🎯 BOOKINAILS PRE-LAUNCH CHECK - NIVEAU EINSTEINIEN 72D++')
    console.log('=' .repeat(70))
    console.log(`📅 ${new Date().toISOString()}`)
    console.log('')

    const checks = [
      () => this.checkProjectStructure(),
      () => this.checkDependencies(),
      () => this.checkEnvironmentVariables(),
      () => this.checkBuildProcess(),
      () => this.checkTests(),
      () => this.checkSecurity(),
      () => this.checkPWAManifest(),
      () => this.checkSEOFiles(),
      () => this.checkDocumentation(),
      () => this.checkCICD(),
      () => this.checkAPIEndpoints(),
      () => this.checkDatabaseMigrations()
    ]

    for (const check of checks) {
      try {
        await check()
      } catch (error) {
        this.addResult(false, `Check failed: ${error.message}`)
      }
    }

    await this.generateFinalReport()
  }

  async checkProjectStructure() {
    this.log('📁 Vérification structure projet...')
    
    const requiredFiles = [
      'package.json',
      'frontend/package.json',
      'backend/requirements.txt',
      'docker-compose.yml',
      'README.md',
      'QUICKSTART.md',
      '.env.example',
      'playwright.config.ts'
    ]

    const requiredDirs = [
      'frontend/pages',
      'frontend/components',
      'backend/routers',
      'backend/models',
      'tests/e2e',
      'tests/components',
      'tests/utils',
      '.github/workflows'
    ]

    for (const file of requiredFiles) {
      try {
        await fs.access(file)
        this.addResult(true, `✅ ${file}`)
      } catch {
        this.addResult(false, `❌ Fichier manquant: ${file}`)
      }
    }

    for (const dir of requiredDirs) {
      try {
        const stat = await fs.stat(dir)
        if (stat.isDirectory()) {
          this.addResult(true, `✅ ${dir}/`)
        }
      } catch {
        this.addResult(false, `❌ Répertoire manquant: ${dir}/`)
      }
    }
  }

  async checkDependencies() {
    this.log('📦 Vérification dépendances...')
    
    try {
      // Frontend dependencies
      const frontendPkg = JSON.parse(await fs.readFile('frontend/package.json', 'utf8'))
      const criticalDeps = [
        'next', 'react', 'typescript', 'tailwindcss', 
        '@playwright/test', 'lucide-react', 'date-fns'
      ]
      
      for (const dep of criticalDeps) {
        if (frontendPkg.dependencies?.[dep] || frontendPkg.devDependencies?.[dep]) {
          this.addResult(true, `✅ Frontend: ${dep}`)
        } else {
          this.addResult(false, `❌ Dépendance manquante: ${dep}`)
        }
      }

      // Backend dependencies
      const backendReqs = await fs.readFile('backend/requirements.txt', 'utf8')
      const backendDeps = ['fastapi', 'sqlalchemy', 'stripe', 'pytest']
      
      for (const dep of backendDeps) {
        if (backendReqs.includes(dep)) {
          this.addResult(true, `✅ Backend: ${dep}`)
        } else {
          this.addResult(false, `❌ Dépendance backend manquante: ${dep}`)
        }
      }

    } catch (error) {
      this.addResult(false, `Erreur vérification dépendances: ${error.message}`)
    }
  }

  async checkEnvironmentVariables() {
    this.log('🔧 Vérification variables environnement...')
    
    try {
      const envExample = await fs.readFile('.env.example', 'utf8')
      const requiredVars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_SECRET_KEY',
        'JWT_SECRET',
        'DATABASE_URL'
      ]
      
      for (const variable of requiredVars) {
        if (envExample.includes(variable)) {
          this.addResult(true, `✅ Variable: ${variable}`)
        } else {
          this.addResult(false, `❌ Variable manquante: ${variable}`)
        }
      }
      
    } catch (error) {
      this.addResult(false, `Erreur .env.example: ${error.message}`)
    }
  }

  async checkBuildProcess() {
    this.log('🔨 Vérification build process...')
    
    try {
      // Test frontend build
      const { stdout: frontendBuild } = await execAsync('cd frontend && npm run build', { timeout: 60000 })
      if (frontendBuild.includes('Compiled successfully')) {
        this.addResult(true, '✅ Frontend build réussi')
      } else {
        this.addResult(false, '❌ Frontend build échoué')
      }
      
    } catch (error) {
      this.addResult(false, `Build process erreur: ${error.message}`)
    }
  }

  async checkTests() {
    this.log('🧪 Vérification tests...')
    
    try {
      // Vérifier fichiers de test
      const testFiles = [
        'tests/e2e/booking-flow.spec.ts',
        'tests/components/ui-components.spec.ts',
        'tests/utils/performance-audit.js',
        'tests/utils/accessibility-audit.js'
      ]
      
      for (const testFile of testFiles) {
        try {
          await fs.access(testFile)
          this.addResult(true, `✅ Test: ${testFile}`)
        } catch {
          this.addResult(false, `❌ Test manquant: ${testFile}`)
        }
      }
      
      // Test configuration Playwright
      try {
        await fs.access('playwright.config.ts')
        this.addResult(true, '✅ Configuration Playwright')
      } catch {
        this.addResult(false, '❌ playwright.config.ts manquant')
      }
      
    } catch (error) {
      this.addResult(false, `Erreur vérification tests: ${error.message}`)
    }
  }

  async checkSecurity() {
    this.log('🔒 Vérification sécurité...')
    
    try {
      // Vérifier audit npm
      const { stdout } = await execAsync('npm audit --json', { cwd: 'frontend' })
      const auditResult = JSON.parse(stdout)
      
      if (auditResult.metadata.vulnerabilities.high === 0 && auditResult.metadata.vulnerabilities.critical === 0) {
        this.addResult(true, '✅ Pas de vulnérabilités critiques')
      } else {
        this.addResult(false, `❌ Vulnérabilités: ${auditResult.metadata.vulnerabilities.high} high, ${auditResult.metadata.vulnerabilities.critical} critical`)
      }
      
    } catch (error) {
      this.addResult(false, `Erreur audit sécurité: ${error.message}`)
    }
  }

  async checkPWAManifest() {
    this.log('📱 Vérification PWA...')
    
    try {
      const manifest = JSON.parse(await fs.readFile('frontend/public/manifest.json', 'utf8'))
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons']
      
      for (const field of requiredFields) {
        if (manifest[field]) {
          this.addResult(true, `✅ PWA: ${field}`)
        } else {
          this.addResult(false, `❌ PWA manquant: ${field}`)
        }
      }
      
      // Vérifier Service Worker
      try {
        await fs.access('frontend/public/sw.js')
        this.addResult(true, '✅ Service Worker')
      } catch {
        this.addResult(false, '❌ Service Worker manquant')
      }
      
    } catch (error) {
      this.addResult(false, `Erreur PWA: ${error.message}`)
    }
  }

  async checkSEOFiles() {
    this.log('🔍 Vérification SEO...')
    
    const seoFiles = [
      'frontend/public/robots.txt',
      'frontend/public/sitemap.xml',
    ]
    
    for (const file of seoFiles) {
      try {
        await fs.access(file)
        this.addResult(true, `✅ SEO: ${path.basename(file)}`)
      } catch {
        this.addResult(false, `❌ SEO manquant: ${path.basename(file)}`)
      }
    }
    
    // Vérifier composants SEO
    try {
      const seoComponent = await fs.readFile('frontend/components/SEO.tsx', 'utf8')
      if (seoComponent.includes('Schema.org') && seoComponent.includes('OpenGraph')) {
        this.addResult(true, '✅ Composant SEO complet')
      } else {
        this.addResult(false, '❌ Composant SEO incomplet')
      }
    } catch {
      this.addResult(false, '❌ Composant SEO manquant')
    }
  }

  async checkDocumentation() {
    this.log('📚 Vérification documentation...')
    
    const docFiles = [
      { file: 'README.md', minLength: 1000 },
      { file: 'QUICKSTART.md', minLength: 500 },
    ]
    
    for (const { file, minLength } of docFiles) {
      try {
        const content = await fs.readFile(file, 'utf8')
        if (content.length >= minLength) {
          this.addResult(true, `✅ Doc: ${file} (${content.length} chars)`)
        } else {
          this.addResult(false, `❌ Doc insuffisante: ${file} (${content.length} < ${minLength})`)
        }
      } catch {
        this.addResult(false, `❌ Doc manquante: ${file}`)
      }
    }
  }

  async checkCICD() {
    this.log('🔄 Vérification CI/CD...')
    
    try {
      await fs.access('.github/workflows/test-e2e.yml')
      this.addResult(true, '✅ GitHub Actions E2E')
    } catch {
      this.addResult(false, '❌ Workflow E2E manquant')
    }
    
    try {
      await fs.access('.github/workflows/ci.yml')
      this.addResult(true, '✅ GitHub Actions CI')
    } catch {
      this.addResult(false, '❌ Workflow CI manquant')
    }
  }

  async checkAPIEndpoints() {
    this.log('🌐 Vérification API endpoints...')
    
    try {
      const mainPy = await fs.readFile('backend/main.py', 'utf8')
      const criticalRouters = ['auth', 'salons', 'reservations', 'payments']
      
      for (const router of criticalRouters) {
        if (mainPy.includes(`${router}.router`)) {
          this.addResult(true, `✅ API: ${router}`)
        } else {
          this.addResult(false, `❌ Router manquant: ${router}`)
        }
      }
      
    } catch (error) {
      this.addResult(false, `Erreur vérification API: ${error.message}`)
    }
  }

  async checkDatabaseMigrations() {
    this.log('🗄️ Vérification base de données...')
    
    try {
      const modelsDir = await fs.readdir('backend/models')
      if (modelsDir.length > 0) {
        this.addResult(true, `✅ Modèles DB: ${modelsDir.length} fichiers`)
      } else {
        this.addResult(false, '❌ Pas de modèles DB')
      }
      
    } catch (error) {
      this.addResult(false, `Erreur DB: ${error.message}`)
    }
  }

  log(message) {
    console.log(message)
  }

  addResult(passed, message) {
    this.checks.push({ passed, message })
    if (passed) {
      this.results.passed++
    } else {
      this.results.failed++
    }
  }

  async generateFinalReport() {
    const total = this.results.passed + this.results.failed
    this.results.score = Math.round((this.results.passed / total) * 100)
    
    console.log('\n🎯 RAPPORT FINAL PRE-LAUNCH CHECK')
    console.log('=' .repeat(50))
    console.log(`Score global: ${this.results.score}/100`)
    console.log(`✅ Validé: ${this.results.passed}`)
    console.log(`❌ Échecs: ${this.results.failed}`)
    console.log(`📊 Total: ${total} vérifications`)
    
    // Détail des échecs
    if (this.results.failed > 0) {
      console.log('\n⚠️ POINTS À CORRIGER:')
      this.checks
        .filter(c => !c.passed)
        .forEach(c => console.log(`   ${c.message}`))
    }
    
    // Verdict final
    console.log('\n🏆 VERDICT FINAL:')
    if (this.results.score >= 95) {
      console.log('🚀 BOOKINAILS READY FOR PRODUCTION! 🎉')
      console.log('   Toutes les vérifications critiques passées')
      console.log('   Déploiement autorisé en production')
    } else if (this.results.score >= 85) {
      console.log('⚠️ Optimisations mineures recommandées')
      console.log('   Déploiement possible mais améliorations suggérées')
    } else {
      console.log('❌ Corrections requises avant production')
      console.log('   Résoudre les problèmes critiques avant déploiement')
    }
    
    // Sauvegarder rapport
    const reportData = {
      timestamp: new Date().toISOString(),
      score: this.results.score,
      results: this.results,
      checks: this.checks,
      verdict: this.results.score >= 95 ? 'READY' : this.results.score >= 85 ? 'WARNING' : 'FAILED'
    }
    
    await fs.writeFile('prelaunch-report.json', JSON.stringify(reportData, null, 2))
    console.log('\n📊 Rapport détaillé sauvegardé: prelaunch-report.json')
    
    // Exit code
    process.exit(this.results.score >= 85 ? 0 : 1)
  }
}

// Lancer la vérification
if (require.main === module) {
  const checker = new PreLaunchChecker()
  checker.runAllChecks().catch(console.error)
}

module.exports = { PreLaunchChecker }
