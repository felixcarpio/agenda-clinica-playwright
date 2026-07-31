import { expect, type Page } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { getCredentials, type UserRole } from './credentials.helper';
import { routes } from '../utils/routes';

type ActiveUserRole = Exclude<UserRole, 'INACTIVE'>;

/**
 * Inicia sesión con el usuario correspondiente al rol indicado.
 *
 * @param page Página actual de Playwright.
 * @param role Rol del usuario que iniciará sesión.
 */
export async function loginAs(
  page: Page,
  role: ActiveUserRole
): Promise<void> {
  const credentials = getCredentials(role);
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);

  await expect(page).toHaveURL(
    new RegExp(`${getDashboardRoute(role)}/?$`)
  );
}

/**
 * Inicia sesión utilizando las credenciales del usuario inactivo.
 *
 * No valida redirección porque el usuario debe permanecer en el login.
 */
export async function loginAsInactive(page: Page): Promise<void> {
  const credentials = getCredentials('INACTIVE');
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
}

/**
 * Obtiene la ruta del dashboard correspondiente a un rol.
 */
function getDashboardRoute(role: ActiveUserRole): string {
  const dashboardRoutes: Record<ActiveUserRole, string> = {
    ADMIN: routes.dashboards.admin,
    PSYCHOLOGIST: routes.dashboards.psychologist,
    PATIENT: routes.dashboards.patient,
  };

  return dashboardRoutes[role];
}