import { test, expect } from '@playwright/test'

test.describe('Bookinails - Flux de réservation complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Parcours utilisateur complet: recherche → réservation → paiement', async ({ page }) => {
    // 1. Page d'accueil
    await expect(page.locator('h2')).toContainText('Réservez votre')
    
    // 2. Recherche de salon
    await page.fill('[placeholder*="ville"]', 'Paris')
    await page.click('button:has-text("Rechercher")')
    
    // 3. Vérifier les résultats
    await expect(page.locator('.salon-card')).toBeVisible()
    await expect(page.locator('.salon-card')).toHaveCount.toBeGreaterThan(0)
    
    // 4. Cliquer sur un salon
    await page.click('.salon-card:first-child')
    
    // 5. Page salon détail
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="salon-rating"]')).toBeVisible()
    
    // 6. Sélectionner un service
    await page.click('[data-testid="service-card"]:first-child')
    
    // 7. Choisir un créneau
    await page.click('[data-testid="time-slot"]:first-child')
    
    // 8. Bouton réserver
    await page.click('button:has-text("Réserver")')
    
    // 9. Formulaire de réservation
    await page.fill('[name="name"]', 'Marie Test')
    await page.fill('[name="email"]', 'marie.test@example.com')
    await page.fill('[name="phone"]', '0123456789')
    
    // 10. Confirmer la réservation
    await page.click('button:has-text("Confirmer")')
    
    // 11. Page de confirmation
    await expect(page.locator('h1')).toContainText('Réservation confirmée')
    await expect(page.locator('[data-testid="booking-details"]')).toBeVisible()
  })

  test('Authentification utilisateur', async ({ page }) => {
    // Test inscription
    await page.click('a:has-text("S\'inscrire")')
    await expect(page).toHaveURL(/\/register/)
    
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@bookinails.test')
    await page.fill('[name="password"]', 'password123')
    await page.fill('[name="phone"]', '0123456789')
    
    await page.click('button:has-text("Créer mon compte")')
    
    // Vérifier redirection dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('Recherche avec filtres avancés', async ({ page }) => {
    await page.fill('[placeholder*="ville"]', 'Paris')
    
    // Ouvrir les filtres
    await page.click('button:has-text("Filtres")')
    
    // Appliquer des filtres
    await page.selectOption('[name="service"]', 'manucure-francaise')
    await page.selectOption('[name="price_range"]', '€€')
    await page.fill('[name="min_rating"]', '4.5')
    
    await page.click('button:has-text("Appliquer")')
    
    // Vérifier résultats filtrés
    const results = page.locator('.salon-card')
    await expect(results).toHaveCount.toBeGreaterThan(0)
    
    // Vérifier que les notes sont >= 4.5
    const ratings = await results.locator('[data-testid="rating"]').all()
    for (const rating of ratings) {
      const value = await rating.textContent()
      expect(parseFloat(value || '0')).toBeGreaterThanOrEqual(4.5)
    }
  })

  test('Géolocalisation "Près de moi"', async ({ page, context }) => {
    // Mock géolocalisation Paris
    await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
    
    // Cliquer sur "Près de moi"
    await page.click('button:has-text("Près de moi")')
    
    // Vérifier que la recherche s'active
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible()
    
    // Vérifier résultats géolocalisés
    await expect(page.locator('.salon-card')).toHaveCount.toBeGreaterThan(0)
  })
})

test.describe('Assistant IA Naia', () => {
  test('Interaction avec l\'assistant IA', async ({ page }) => {
    await page.goto('/')
    
    // Ouvrir l'assistant IA
    await page.click('[data-testid="ai-assistant-trigger"]')
    
    // Vérifier ouverture du chat
    await expect(page.locator('[data-testid="ai-chat"]')).toBeVisible()
    await expect(page.locator('text=Naia')).toBeVisible()
    
    // Envoyer un message
    await page.fill('[placeholder*="question"]', 'Je cherche une manucure française')
    await page.click('button[aria-label*="Envoyer"]')
    
    // Vérifier réponse de l'IA
    await expect(page.locator('.ai-message')).toContainText('manucure française')
    await expect(page.locator('[data-testid="salon-suggestions"]')).toBeVisible()
    
    // Tester une suggestion
    await page.click('[data-testid="suggestion"]:first-child')
    await expect(page.locator('.ai-message')).toHaveCount.toBeGreaterThan(1)
  })
})

test.describe('Système de fidélité', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter d'abord
    await page.goto('/login')
    await page.fill('[name="email"]', 'client@test.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button:has-text("Se connecter")')
  })

  test('Affichage carte fidélité', async ({ page }) => {
    await page.goto('/dashboard/client')
    
    // Vérifier carte fidélité
    await expect(page.locator('[data-testid="loyalty-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="points-balance"]')).toBeVisible()
    await expect(page.locator('[data-testid="tier-badge"]')).toBeVisible()
  })

  test('Système de parrainage', async ({ page }) => {
    await page.goto('/dashboard/client')
    
    // Ouvrir section parrainage
    await page.click('text=Parrainage')
    
    // Vérifier code de parrainage
    await expect(page.locator('[data-testid="referral-code"]')).toBeVisible()
    
    // Test partage
    await page.click('button:has-text("Partager")')
    
    // Vérifier que le partage fonctionne (ou clipboard)
    const referralCode = await page.locator('[data-testid="referral-code"]').inputValue()
    expect(referralCode).toMatch(/^[A-Z0-9]{6,}$/)
  })
})
