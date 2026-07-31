import { test, expect } from '../../fixtures/pages.fixture';

import { loginAs } from '../../helpers/auth.helper';
import { routes } from '../../utils/routes';

/**
 * Pruebas automatizadas del cierre de sesión.
 *
 * Se utiliza una cuenta de paciente, pero el comportamiento
 * del menú de usuario y del cierre de sesión es compartido
 * por todos los roles autenticados.
 */
test.describe('Cierre de sesión', () => {
  /**
   * Antes de cada escenario se inicia sesión con un paciente activo.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PATIENT');
  });

  test('Debe mostrar correctamente el menú del usuario', async ({ dashboardPage }) => {
    // Valida que el menú desplegable inicie oculto.
    await expect(dashboardPage.userMenuDropdown).toBeHidden();

    // Abre el menú del usuario autenticado.
    await dashboardPage.openUserMenu();

    // Valida el contenido y el estado abierto del menú.
    await dashboardPage.expectUserMenuVisible();
  });

  test('Debe cerrar sesión y regresar a la pantalla de login', async ({ page, dashboardPage }) => {
    // Cierra la sesión activa.
    await dashboardPage.logout();

    // Valida la redirección y el título de la pantalla de login.
    await expect(page).toHaveURL(/\/accounts\/login\/$/);
    await expect(page).toHaveTitle('Iniciar sesión | MindCare');

    // Valida que la estructura autenticada ya no esté visible.
    await expect(dashboardPage.dashboardLayout).not.toBeVisible();
  });

  test('Debe impedir el acceso al dashboard después de cerrar sesión', async ({ page, dashboardPage }) => {
    // Cierra la sesión activa.
    await dashboardPage.logout();

    // Valida la redirección inicial hacia el login.
    await expect(page).toHaveURL(/\/accounts\/login\/$/);

    // Intenta acceder directamente a una ruta protegida.
    await page.goto(routes.dashboards.patient);

    // Valida que Django redirija nuevamente al login.
    await expect(page).toHaveURL(/\/accounts\/login\/\?next=\/dashboard\/paciente\/?$/);
  });
});