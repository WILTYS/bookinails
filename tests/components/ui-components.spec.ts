import { test, expect } from '@playwright/test'

test.describe('Composants UI - Tests unitaires', () => {
  
  test.describe('Skeleton Loaders', () => {
    test('Skeleton loader salon cards', async ({ page }) => {
      await page.goto('/')
      
      // Intercepter l'API pour forcer le loading
      await page.route('/api/salons*', async route => {
        await page.waitForTimeout(2000)
        await route.continue()
      })
      
      await page.fill('[placeholder*="ville"]', 'Paris')
      await page.click('button:has-text("Rechercher")')
      
      // Vérifier présence des skeletons
      await expect(page.locator('.skeleton')).toHaveCount.toBeGreaterThan(0)
      await expect(page.locator('.animate-pulse')).toBeVisible()
    })

    test('Dashboard skeleton loading', async ({ page }) => {
      await page.goto('/login')
      await page.fill('[name="email"]', 'client@test.com')
      await page.fill('[name="password"]', 'password123')
      
      // Intercepter dashboard API
      await page.route('/api/dashboard*', async route => {
        await page.waitForTimeout(1500)
        await route.continue()
      })
      
      await page.click('button:has-text("Se connecter")')
      
      // Vérifier skeleton dashboard
      await expect(page.locator('[data-testid="dashboard-skeleton"]')).toBeVisible()
    })
  })

  test.describe('Animations Tailwind', () => {
    test('Animation fade-in sur les cartes', async ({ page }) => {
      await page.goto('/')
      await page.fill('[placeholder*="ville"]', 'Paris')
      await page.click('button:has-text("Rechercher")')
      
      // Attendre le chargement
      await page.waitForSelector('.salon-card')
      
      // Vérifier classes d'animation
      const cards = page.locator('.salon-card')
      await expect(cards.first()).toHaveClass(/animate-fade-in|fade-in/)
    })

    test('Animation slide-up des modales', async ({ page }) => {
      await page.goto('/')
      
      // Ouvrir assistant IA
      await page.click('[data-testid="ai-assistant-trigger"]')
      
      // Vérifier animation slide-up
      await expect(page.locator('[data-testid="ai-chat"]')).toHaveClass(/animate-slide-up|slide-up/)
    })
  })

  test.describe('Carte interactive', () => {
    test('Affichage des pins de salons', async ({ page, context }) => {
      await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
      
      await page.goto('/')
      await page.fill('[placeholder*="ville"]', 'Paris')
      await page.click('button:has-text("Rechercher")')
      
      // Vue carte
      await page.click('button:has-text("Carte")')
      
      // Vérifier pins
      await expect(page.locator('[data-testid="salon-pin"]')).toHaveCount.toBeGreaterThan(0)
    })

    test('Tooltip salon sur hover', async ({ page }) => {
      await page.goto('/')
      await page.fill('[placeholder*="ville"]', 'Paris')
      await page.click('button:has-text("Rechercher")')
      await page.click('button:has-text("Carte")')
      
      // Hover sur pin
      await page.hover('[data-testid="salon-pin"]:first-child')
      
      // Vérifier tooltip
      await expect(page.locator('[data-testid="salon-tooltip"]')).toBeVisible()
      await expect(page.locator('[data-testid="salon-tooltip"]')).toContainText(/\d\.\d/) // Rating
    })

    test('Géolocalisation utilisateur', async ({ page, context }) => {
      await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
      
      await page.goto('/')
      await page.click('button:has-text("Carte")')
      await page.click('[data-testid="geolocation-btn"]')
      
      // Vérifier position utilisateur
      await expect(page.locator('[data-testid="user-position"]')).toBeVisible()
    })
  })

  test.describe('Messagerie', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.fill('[name="email"]', 'client@test.com')
      await page.fill('[name="password"]', 'password123')
      await page.click('button:has-text("Se connecter")')
    })

    test('Interface chat', async ({ page }) => {
      await page.goto('/dashboard/client')
      await page.click('text=Messages')
      
      // Vérifier liste conversations
      await expect(page.locator('[data-testid="conversation-list"]')).toBeVisible()
      
      // Ouvrir conversation
      await page.click('[data-testid="conversation"]:first-child')
      
      // Vérifier chat interface
      await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible()
      await expect(page.locator('[data-testid="message-input"]')).toBeVisible()
    })

    test('Envoi de message', async ({ page }) => {
      await page.goto('/dashboard/client')
      await page.click('text=Messages')
      await page.click('[data-testid="conversation"]:first-child')
      
      const testMessage = 'Test message ' + Date.now()
      
      // Envoyer message
      await page.fill('[data-testid="message-input"]', testMessage)
      await page.click('[data-testid="send-button"]')
      
      // Vérifier message envoyé
      await expect(page.locator('[data-testid="sent-message"]').last()).toContainText(testMessage)
    })

    test('Indicateur de frappe', async ({ page }) => {
      await page.goto('/dashboard/client')
      await page.click('text=Messages')
      await page.click('[data-testid="conversation"]:first-child')
      
      // Simuler frappe
      await page.fill('[data-testid="message-input"]', 'Test...')
      
      // Vérifier indicateur de frappe (côté récepteur)
      // Note: Nécessiterait WebSocket real-time
      await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('PWA Installation', () => {
    test('Prompt d\'installation PWA', async ({ page, context }) => {
      // Simuler beforeinstallprompt
      await page.addInitScript(() => {
        window.addEventListener('load', () => {
          const event = new Event('beforeinstallprompt')
          // @ts-ignore
          event.prompt = () => Promise.resolve()
          // @ts-ignore
          event.userChoice = Promise.resolve({ outcome: 'accepted' })
          window.dispatchEvent(event)
        })
      })
      
      await page.goto('/')
      
      // Attendre le prompt d'installation
      await expect(page.locator('[data-testid="pwa-install-prompt"]')).toBeVisible({ timeout: 10000 })
      
      // Cliquer installer
      await page.click('button:has-text("Installer")')
      
      // Vérifier que le prompt disparaît
      await expect(page.locator('[data-testid="pwa-install-prompt"]')).not.toBeVisible()
    })

    test('Page offline', async ({ page, context }) => {
      // Simuler mode offline
      await context.setOffline(true)
      
      await page.goto('/offline-test-page', { waitUntil: 'networkidle' })
      
      // Vérifier page offline
      await expect(page.locator('text=Vous êtes hors ligne')).toBeVisible()
      await expect(page.locator('button:has-text("Réessayer")')).toBeVisible()
    })
  })

  test.describe('Dashboard Pro Analytics', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.fill('[name="email"]', 'pro@test.com')
      await page.fill('[name="password"]', 'password123')
      await page.click('button:has-text("Se connecter")')
    })

    test('Affichage des statistiques', async ({ page }) => {
      await page.goto('/dashboard/pro')
      
      // Vérifier KPIs
      await expect(page.locator('[data-testid="revenue-stat"]')).toBeVisible()
      await expect(page.locator('[data-testid="bookings-stat"]')).toBeVisible()
      await expect(page.locator('[data-testid="clients-stat"]')).toBeVisible()
      await expect(page.locator('[data-testid="occupancy-stat"]')).toBeVisible()
      
      // Vérifier graphiques
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible()
      await expect(page.locator('[data-testid="services-chart"]')).toBeVisible()
    })

    test('Générateur de factures', async ({ page }) => {
      await page.goto('/dashboard/pro')
      await page.click('text=Factures')
      
      // Nouvelle facture
      await page.click('button:has-text("Nouvelle facture")')
      
      // Remplir formulaire
      await page.fill('[name="client_name"]', 'Client Test')
      await page.fill('[name="client_email"]', 'client@test.com')
      await page.fill('[name="services.0.name"]', 'Manucure française')
      await page.fill('[name="services.0.unit_price"]', '35')
      
      // Créer facture
      await page.click('button:has-text("Créer")')
      
      // Vérifier facture créée
      await expect(page.locator('[data-testid="invoice-card"]')).toContainText('Client Test')
    })

    test('Export PDF facture', async ({ page }) => {
      await page.goto('/dashboard/pro')
      await page.click('text=Factures')
      
      // Mock download
      const downloadPromise = page.waitForEvent('download')
      await page.click('[data-testid="invoice-card"] button:has-text("PDF")')
      
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/facture.*\.pdf/)
    })
  })
})
