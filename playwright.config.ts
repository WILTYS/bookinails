import { defineConfig, devices } from '@playwright/test'

/**
 * Configuration Playwright pour Bookinails
 * Tests end-to-end niveau Einsteinien 72D++
 */
export default defineConfig({
  // Répertoire des tests
  testDir: './tests',
  
  // Timeout global
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  
  // Lancer en parallèle
  fullyParallel: true,
  
  // Ne pas continuer si échec en CI
  forbidOnly: !!process.env.CI,
  
  // Retry en cas d'échec
  retries: process.env.CI ? 2 : 0,
  
  // Nombre de workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter pour les résultats
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Configuration globale
  use: {
    // URL de base
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Timeout des actions
    actionTimeout: 15000,
    
    // Timeout de navigation
    navigationTimeout: 30000,
    
    // Traces pour debug
    trace: 'retain-on-failure',
    
    // Screenshots
    screenshot: 'only-on-failure',
    
    // Vidéos
    video: 'retain-on-failure',
    
    // Headers par défaut
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9',
    },
  },

  // Projets de test pour différents navigateurs/devices
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },
    
    // Mobile Devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
      dependencies: ['setup'],
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
      },
      dependencies: ['setup'],
    },
    
    // Tests de performance (seulement Chrome)
    {
      name: 'performance',
      testMatch: /.*\.perf\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },
    
    // Tests d'accessibilité
    {
      name: 'accessibility',
      testMatch: /.*\.a11y\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },
  ],

  // Serveur de développement
  webServer: [
    {
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        NODE_ENV: 'test',
        NEXT_PUBLIC_API_URL: 'http://localhost:8000',
        // Variables de test
        SKIP_ENV_VALIDATION: 'true',
      }
    },
    {
      command: 'cd backend && uvicorn main:app --port 8000',
      port: 8000,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: {
        ENVIRONMENT: 'test',
        DATABASE_URL: 'sqlite:///./test.db'
      }
    }
  ],

  // Dossiers de sortie
  outputDir: 'test-results/',
  
  // Métadonnées globales
  globalSetup: require.resolve('./tests/global-setup'),
  globalTeardown: require.resolve('./tests/global-teardown'),
}
