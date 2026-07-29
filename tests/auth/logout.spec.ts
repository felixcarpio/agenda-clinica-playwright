import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboards/dashboard.page';
import { routes } from '../../utils/routes';

/**
 * Obtiene y valida las credenciales de un paciente activo.
 *
 * Se utiliza un paciente para probar el cierre de sesión,
 * pero el comportamiento es compartido por todos los roles.
 */
function requirePatientCredentials(): {
  email: string;
  password: string;
} {
  const email = process.env.PATIENT_USER_EMAIL;
  const password = process.env.PATIENT_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Faltan PATIENT_USER_EMAIL o ' +
        'PATIENT_USER_PASSWORD en el archivo .env'
    );
  }

  return { email, password };
}

test.describe('Cierre de sesión', () => {
  let dashboardPage: DashboardPage;

  /**
   * Antes de cada escenario:
   * 1. Se inicia sesión con un paciente activo.
   * 2. Se valida el acceso al dashboard.
   * 3. Se crea el Page Object compartido.
   */
  test.beforeEach(async ({ page }) => {
    const credentials = requirePatientCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);

    await expect(page).toHaveURL(
      new RegExp(`${routes.dashboards.patient}/?$`)
    );

    dashboardPage = new DashboardPage(page);
  });

  test(
    'Debe mostrar correctamente el menú del usuario',
    async () => {
      // El menú debe iniciar oculto.
      await expect(dashboardPage.userMenuDropdown).toBeHidden();

      // Abre el menú del usuario.
      await dashboardPage.openUserMenu();

      // El menú debe quedar visible.
      await expect(dashboardPage.userMenuDropdown).toBeVisible();

      // Valida la información y controles disponibles.
      await expect(dashboardPage.dropdownUserName).toBeVisible();
      await expect(dashboardPage.dropdownUserEmail).toBeVisible();

      await expect(dashboardPage.profileLink).toBeVisible();
      await expect(dashboardPage.profileLink).toHaveText('Mi perfil');

      await expect(dashboardPage.logoutButton).toBeVisible();
      await expect(dashboardPage.logoutButton).toHaveText(
        'Cerrar sesión'
      );

      // Valida que el botón actualice su estado accesible.
      await expect(dashboardPage.userMenuToggle).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    }
  );

  test(
    'Debe cerrar sesión y regresar a la pantalla de login',
    async ({ page }) => {
      await dashboardPage.logout();

      // Valida que la sesión terminó correctamente.
      await expect(page).toHaveURL(/\/accounts\/login\/$/);

      await expect(page).toHaveTitle(
        'Iniciar sesión | MindCare'
      );

      // El dashboard ya no debe estar visible.
      await expect(
        dashboardPage.dashboardLayout
      ).not.toBeVisible();
    }
  );

  test(
    'Debe impedir el acceso al dashboard después de cerrar sesión',
    async ({ page }) => {
      await dashboardPage.logout();

      await expect(page).toHaveURL(/\/accounts\/login\/$/);

      // Intenta acceder directamente al dashboard del paciente.
      await page.goto(routes.dashboards.patient);

      // Django debe redirigir nuevamente al login.
      await expect(page).toHaveURL(
        /\/accounts\/login\/\?next=\/dashboard\/paciente\/?$/
      );
    }
  );
});