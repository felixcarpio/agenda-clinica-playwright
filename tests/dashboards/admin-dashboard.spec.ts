import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/login.page';
import { AdminDashboardPage } from '../../pages/dashboards/admin-dashboard.page';
import { routes } from '../../utils/routes';

/**
 * Obtiene y valida las credenciales del administrador.
 *
 * @returns Credenciales necesarias para iniciar sesión.
 */
function requireAdminCredentials(): {
  email: string;
  password: string;
} {
  const email = process.env.ADMIN_USER_EMAIL;
  const password = process.env.ADMIN_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Faltan ADMIN_USER_EMAIL o ' +
        'ADMIN_USER_PASSWORD en el archivo .env'
    );
  }

  return { email, password };
}

test.describe('Dashboard del administrador', () => {
  let adminDashboard: AdminDashboardPage;

  /**
   * Antes de cada escenario:
   * 1. Se abre la pantalla de inicio de sesión.
   * 2. Se inicia sesión con un administrador activo.
   * 3. Se crea el Page Object del dashboard.
   * 4. Se valida la redirección al panel administrativo.
   */
  test.beforeEach(async ({ page }) => {
    const credentials = requireAdminCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);

    adminDashboard = new AdminDashboardPage(page);

    await expect(page).toHaveURL(
      new RegExp(`${routes.dashboards.admin}/?$`)
    );
  });

  test(
    'Debe mostrar correctamente la estructura principal',
    async ({ page }) => {
      await expect(page).toHaveTitle(
        'Administración | Agenda Clínica'
      );

      await expect(adminDashboard.dashboardLayout).toBeVisible();
      await expect(adminDashboard.sidebar).toBeVisible();
      await expect(adminDashboard.header).toBeVisible();
      await expect(adminDashboard.footer).toBeVisible();

      await expect(adminDashboard.sidebarLogo).toBeVisible();
      await expect(adminDashboard.sidebarBrandName).toHaveText(
        'MindCare'
      );
      await expect(adminDashboard.sidebarBrandSubtitle).toHaveText(
        'Agenda clínica'
      );

      await expect(adminDashboard.headerEyebrow).toHaveText(
        'Agenda clínica'
      );
      await expect(adminDashboard.headerTitle).toHaveText(
        'Panel de administración'
      );

      await expect(adminDashboard.userName).toBeVisible();
      await expect(adminDashboard.userRole).toHaveText(
        'Administrador'
      );
      await expect(adminDashboard.userAvatar).toBeVisible();

      await expect(adminDashboard.footerCopyright).toContainText(
        'Agenda Clínica Psicológica'
      );
      await expect(adminDashboard.footerVersion).toHaveText(
        'Versión 1.0'
      );
    }
  );

  test(
    'Debe mostrar las opciones de navegación del administrador',
    async () => {
      await expect(adminDashboard.homeLink).toBeVisible();
      await expect(adminDashboard.homeText).toHaveText('Inicio');

      await expect(adminDashboard.usersLink).toBeVisible();
      await expect(adminDashboard.usersText).toHaveText('Usuarios');

      await expect(adminDashboard.psychologistsLink).toBeVisible();
      await expect(adminDashboard.psychologistsText).toHaveText(
        'Psicólogos'
      );

      await expect(adminDashboard.patientsLink).toBeVisible();
      await expect(adminDashboard.patientsText).toHaveText(
        'Pacientes'
      );

      await expect(adminDashboard.reportsLink).toBeVisible();
      await expect(adminDashboard.reportsText).toHaveText(
        'Reportes'
      );
    }
  );

  test(
    'Debe mostrar el encabezado y las tarjetas administrativas',
    async () => {
      await expect(adminDashboard.dashboardHeading).toBeVisible();
      await expect(adminDashboard.dashboardTitle).toHaveText(
        'Panel de administración'
      );
      await expect(adminDashboard.dashboardDescription).toContainText(
        'Consulta el estado general de las cuentas'
      );

      // Tarjeta de usuarios.
      await expect(adminDashboard.usersCard).toBeVisible();
      await expect(adminDashboard.usersTitle).toHaveText('Usuarios');
      await expect(adminDashboard.usersSubtitle).toHaveText(
        'Total de cuentas registradas'
      );
      await expect(adminDashboard.totalUsers).toBeVisible();
      await expect(adminDashboard.usersButton).toHaveText(
        'Ver usuarios'
      );

      // Tarjeta de psicólogos.
      await expect(adminDashboard.psychologistsCard).toBeVisible();
      await expect(adminDashboard.psychologistsTitle).toHaveText(
        'Psicólogos'
      );
      await expect(adminDashboard.activePsychologists).toBeVisible();
      await expect(adminDashboard.psychologistsButton).toHaveText(
        'Ver psicólogos'
      );

      // Tarjeta de pacientes.
      await expect(adminDashboard.patientsCard).toBeVisible();
      await expect(adminDashboard.patientsTitle).toHaveText(
        'Pacientes'
      );
      await expect(adminDashboard.activePatients).toBeVisible();
      await expect(adminDashboard.patientsButton).toHaveText(
        'Ver pacientes'
      );

      // Tarjeta de cuentas inactivas.
      await expect(adminDashboard.inactiveAccountsCard).toBeVisible();
      await expect(adminDashboard.inactiveAccountsTitle).toHaveText(
        'Cuentas inactivas'
      );
      await expect(adminDashboard.inactiveAccountsCount).toBeVisible();
      await expect(adminDashboard.inactiveAccountsButton).toHaveText(
        'Ver cuentas inactivas'
      );

      // Tarjeta de reportes.
      await expect(adminDashboard.reportsCard).toBeVisible();
      await expect(adminDashboard.reportsTitle).toHaveText(
        'Reportes'
      );
      await expect(adminDashboard.totalAppointments).toBeVisible();
      await expect(adminDashboard.reportsButton).toHaveText(
        'Ver reportes'
      );
    }
  );
});