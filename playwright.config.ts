import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Tiempo máximo permitido para cada prueba
  timeout: 30_000,

  // Evita que test.only llegue accidentalmente a CI
  forbidOnly: Boolean(process.env.CI),

  // Reintentos únicamente dentro de CI
  retries: process.env.CI ? 2 : 0,

  // En CI se utiliza un solo worker para mayor estabilidad
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],

  use: {
    // Cambia esta URL por la aplicación que automatizarás
    baseURL: process.env.BASE_URL || 'http://host.docker.internal:8000',

    headless: true,

    // Evidencia para investigar pruebas fallidas
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Tiempo máximo para acciones como click o fill
    actionTimeout: 10_000,

    // Tiempo máximo para cargar páginas
    navigationTimeout: 30_000
  },

  outputDir: 'test-results',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ]
});