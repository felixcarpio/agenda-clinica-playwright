import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboards/dashboard.page';
import { AdminDashboardPage } from '../pages/dashboards/admin-dashboard.page';
import { PatientDashboardPage } from '../pages/dashboards/patient-dashboard.page';
import { PsychologistDashboardPage } from '../pages/dashboards/psychologist-dashboard.page';
import { AvailabilitySlotPage } from '../pages/appointments/availability-slot.page';
import { PatientManagementPage } from '../pages/patients/patient-management.page';

interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminDashboardPage: AdminDashboardPage;
  patientDashboardPage: PatientDashboardPage;
  psychologistDashboardPage: PsychologistDashboardPage;
  availabilitySlotPage: AvailabilitySlotPage;
  patientManagementPage: PatientManagementPage;
}

/**
 * Extiende el objeto `test` de Playwright con los Page Objects
 * utilizados en las pruebas del sistema.
 *
 * Cada fixture crea una instancia del Page Object utilizando
 * la misma página del navegador entregada por Playwright.
 *
 * De esta manera, los escenarios pueden recibir directamente
 * los objetos que necesitan:
 *
 * async ({ page, patientManagementPage }) => {
 *   ...
 * }
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },

  patientDashboardPage: async ({ page }, use) => {
    await use(new PatientDashboardPage(page));
  },

  psychologistDashboardPage: async ({ page }, use) => {
    await use(new PsychologistDashboardPage(page));
  },

  availabilitySlotPage: async ({ page }, use) => {
    await use(new AvailabilitySlotPage(page));
  },

  patientManagementPage: async ({ page }, use) => {
    await use(new PatientManagementPage(page));
  },
});

export { expect };