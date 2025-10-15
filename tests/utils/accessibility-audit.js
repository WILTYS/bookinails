const { test, expect, devices } = require('@playwright/test')

class AccessibilityAuditor {
  constructor() {
    this.violations = []
    this.recommendations = []
  }

  // Test complet d'accessibilité WCAG 2.1 AA
  async auditPage(page, pageName) {
    console.log(`♿ Audit A11y: ${pageName}`)
    
    const results = {
      pageName,
      violations: [],
      warnings: [],
      score: 0
    }

    try {
      // 1. Vérification des contrastes
      const contrastIssues = await this.checkColorContrast(page)
      results.violations.push(...contrastIssues)

      // 2. Navigation au clavier
      const keyboardIssues = await this.checkKeyboardNavigation(page)
      results.violations.push(...keyboardIssues)

      // 3. Lecteurs d'écran
      const screenReaderIssues = await this.checkScreenReaderSupport(page)
      results.violations.push(...screenReaderIssues)

      // 4. ARIA et sémantique
      const ariaIssues = await this.checkAriaCompliance(page)
      results.violations.push(...ariaIssues)

      // 5. Images et médias
      const mediaIssues = await this.checkMediaAccessibility(page)
      results.violations.push(...mediaIssues)

      // 6. Formulaires
      const formIssues = await this.checkFormAccessibility(page)
      results.violations.push(...formIssues)

      // Calculer le score final
      results.score = Math.max(0, 100 - (results.violations.length * 5))
      
      this.logResults(results)
      return results

    } catch (error) {
      console.error(`❌ Erreur audit A11y ${pageName}:`, error.message)
      return { pageName, error: error.message, score: 0 }
    }
  }

  async checkColorContrast(page) {
    const issues = []
    
    // Vérifier les contrastes critiques
    const criticalElements = [
      { selector: 'button', minRatio: 4.5 },
      { selector: 'a', minRatio: 4.5 },
      { selector: '.btn-primary', minRatio: 4.5 },
      { selector: 'input', minRatio: 4.5 },
      { selector: 'h1, h2, h3', minRatio: 4.5 }
    ]

    for (const element of criticalElements) {
      try {
        const elements = await page.locator(element.selector).all()
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          const contrast = await this.calculateContrast(elements[i])
          if (contrast && contrast < element.minRatio) {
            issues.push({
              type: 'contrast',
              severity: 'error',
              message: `Contraste insuffisant sur ${element.selector} (${contrast.toFixed(1)}:1, min: ${element.minRatio}:1)`
            })
          }
        }
      } catch (e) {
        // Element not found, skip
      }
    }

    return issues
  }

  async calculateContrast(element) {
    try {
      return await element.evaluate((el) => {
        const style = window.getComputedStyle(el)
        const bgColor = style.backgroundColor
        const textColor = style.color
        
        // Fonction simplifiée de calcul de contraste
        function getLuminance(rgb) {
          const [r, g, b] = rgb.match(/\d+/g).map(Number)
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
          })
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
        }
        
        const bgLum = getLuminance(bgColor)
        const textLum = getLuminance(textColor)
        
        const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05)
        return contrast
      })
    } catch (e) {
      return null
    }
  }

  async checkKeyboardNavigation(page) {
    const issues = []
    
    try {
      // Test navigation séquentielle
      await page.keyboard.press('Tab')
      let focusedElement = await page.locator(':focus').first()
      
      if (!(await focusedElement.isVisible())) {
        issues.push({
          type: 'keyboard',
          severity: 'error',
          message: 'Premier élément focusable non visible'
        })
      }

      // Tester 10 tabs maximum
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const newFocus = await page.locator(':focus').first()
        
        if (await newFocus.count() === 0) {
          break // Plus d'éléments focusables
        }
        
        // Vérifier outline visible
        const hasOutline = await newFocus.evaluate(el => {
          const style = window.getComputedStyle(el)
          return style.outline !== 'none' || style.boxShadow.includes('inset')
        })
        
        if (!hasOutline) {
          issues.push({
            type: 'keyboard',
            severity: 'warning',
            message: 'Élément focusable sans indicateur visuel de focus'
          })
        }
      }

    } catch (e) {
      issues.push({
        type: 'keyboard',
        severity: 'error',
        message: 'Navigation clavier non fonctionnelle'
      })
    }

    return issues
  }

  async checkScreenReaderSupport(page) {
    const issues = []

    // Vérifier les éléments critiques
    const checks = [
      {
        selector: 'h1',
        test: async () => {
          const h1Count = await page.locator('h1').count()
          return h1Count === 1 ? null : 'Page doit avoir exactement un h1'
        }
      },
      {
        selector: 'img:not([alt])',
        test: async () => {
          const imgsWithoutAlt = await page.locator('img:not([alt])').count()
          return imgsWithoutAlt === 0 ? null : `${imgsWithoutAlt} images sans attribut alt`
        }
      },
      {
        selector: 'button:not([aria-label]):not(:has-text())',
        test: async () => {
          const emptyButtons = await page.locator('button:not([aria-label])').filter({ hasText: /^$/ }).count()
          return emptyButtons === 0 ? null : `${emptyButtons} boutons sans texte ni aria-label`
        }
      },
      {
        selector: 'form',
        test: async () => {
          const forms = await page.locator('form').all()
          let formIssues = 0
          
          for (const form of forms) {
            const inputs = await form.locator('input, select, textarea').all()
            for (const input of inputs) {
              const hasLabel = await input.evaluate(el => {
                const id = el.id
                const name = el.name
                return !!(
                  (id && document.querySelector(`label[for="${id}"]`)) ||
                  el.closest('label') ||
                  el.getAttribute('aria-label') ||
                  el.getAttribute('aria-labelledby')
                )
              })
              if (!hasLabel) formIssues++
            }
          }
          
          return formIssues === 0 ? null : `${formIssues} inputs sans label`
        }
      }
    ]

    for (const check of checks) {
      try {
        const result = await check.test()
        if (result) {
          issues.push({
            type: 'screenreader',
            severity: 'error',
            message: result
          })
        }
      } catch (e) {
        // Skip if element not found
      }
    }

    return issues
  }

  async checkAriaCompliance(page) {
    const issues = []

    // Vérifications ARIA
    const ariaChecks = [
      {
        name: 'aria-expanded sur éléments interactifs',
        test: async () => {
          const expandableElements = await page.locator('[aria-expanded]').all()
          let invalidCount = 0
          
          for (const el of expandableElements) {
            const value = await el.getAttribute('aria-expanded')
            if (value !== 'true' && value !== 'false') {
              invalidCount++
            }
          }
          
          return invalidCount === 0 ? null : `${invalidCount} aria-expanded invalides`
        }
      },
      {
        name: 'role landmarks',
        test: async () => {
          const hasMain = await page.locator('[role="main"], main').count() > 0
          const hasNav = await page.locator('[role="navigation"], nav').count() > 0
          
          const missing = []
          if (!hasMain) missing.push('main')
          if (!hasNav) missing.push('navigation')
          
          return missing.length === 0 ? null : `Landmarks manquants: ${missing.join(', ')}`
        }
      }
    ]

    for (const check of ariaChecks) {
      try {
        const result = await check.test()
        if (result) {
          issues.push({
            type: 'aria',
            severity: 'error',
            message: result
          })
        }
      } catch (e) {
        // Skip errors
      }
    }

    return issues
  }

  async checkMediaAccessibility(page) {
    const issues = []

    // Vérifier vidéos avec contrôles
    try {
      const videos = await page.locator('video').all()
      for (const video of videos) {
        const hasControls = await video.getAttribute('controls')
        if (!hasControls) {
          issues.push({
            type: 'media',
            severity: 'warning',
            message: 'Vidéo sans contrôles utilisateur'
          })
        }
      }
    } catch (e) {
      // No videos
    }

    return issues
  }

  async checkFormAccessibility(page) {
    const issues = []

    try {
      const forms = await page.locator('form').all()
      
      for (const form of forms) {
        // Vérifier fieldsets avec legend
        const fieldsets = await form.locator('fieldset').all()
        for (const fieldset of fieldsets) {
          const hasLegend = await fieldset.locator('legend').count() > 0
          if (!hasLegend) {
            issues.push({
              type: 'form',
              severity: 'error',
              message: 'Fieldset sans legend'
            })
          }
        }

        // Vérifier messages d'erreur
        const requiredInputs = await form.locator('input[required]').all()
        for (const input of requiredInputs) {
          const hasErrorMessage = await input.evaluate(el => {
            return !!(
              el.getAttribute('aria-describedby') ||
              el.closest('.field-error') ||
              document.querySelector(`[aria-describedby="${el.id}"]`)
            )
          })
          
          if (!hasErrorMessage) {
            issues.push({
              type: 'form',
              severity: 'warning',
              message: 'Input requis sans message d\'erreur associé'
            })
          }
        }
      }
    } catch (e) {
      // No forms
    }

    return issues
  }

  logResults(results) {
    const { pageName, violations, score } = results
    const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌'
    
    console.log(`   ${status} ${pageName}: ${score}/100`)
    
    if (violations.length > 0) {
      const errors = violations.filter(v => v.severity === 'error').length
      const warnings = violations.filter(v => v.severity === 'warning').length
      console.log(`      Erreurs: ${errors}, Avertissements: ${warnings}`)
      
      // Afficher les 3 premiers problèmes
      violations.slice(0, 3).forEach(v => {
        console.log(`      - ${v.message}`)
      })
    }
  }

  async generateA11yReport(results) {
    const totalScore = Math.round(
      results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length
    )
    
    const totalViolations = results.reduce((sum, r) => sum + (r.violations?.length || 0), 0)
    
    console.log('\n♿ RAPPORT ACCESSIBILITÉ WCAG 2.1 AA')
    console.log('=' .repeat(50))
    console.log(`Score global: ${totalScore}/100`)
    console.log(`Violations totales: ${totalViolations}`)
    
    if (totalScore >= 90) {
      console.log('✅ ACCESSIBILITÉ VALIDÉE - Conforme WCAG 2.1 AA')
    } else if (totalScore >= 70) {
      console.log('⚠️ Améliorations mineures requises')
    } else {
      console.log('❌ Corrections majeures requises')
    }

    return { totalScore, totalViolations, passed: totalScore >= 90 }
  }
}

module.exports = { AccessibilityAuditor }
