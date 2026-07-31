import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboards/dashboard.page';
import { AdminDashboardPage } from '../pages/dashboards/admin-dashboard.page';
import { PatientDashboardPage } from '../pages/dashboards/patient-dashboard.page';
import { PsychologistDashboardPage } from '../pages/dashboards/psychologist-dashboard.page';
import { AvailabilitySlotPage } from '../pages/appointments/availability-slot.page';

interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminDashboardPage: AdminDashboardPage;
  patientDashboardPage: PatientDashboardPage;
  psychologistDashboardPage: PsychologistDashboardPage;
  availabilitySlotPage: AvailabilitySlotPage;
}

/**
 * Extiende el objeto test de Playwright con los Page Objects
 * utilizados en las pruebas del sistema.
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
});

export { expect };