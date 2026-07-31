import { test, expect } from '../../fixtures/pages.fixture';

import { getCredentials } from '../../helpers/credentials.helper';
import { routes } from '../../utils/routes';

/**
 * Pruebas automatizadas de la pantalla de inicio de sesión.
 *
 * Este archivo valida:
 * - La estructura visual y funcional del formulario.
 * - El inicio de sesión exitoso según el rol del usuario.
 * - El rechazo de credenciales inválidas.
 * - La restricción de acceso para usuarios inactivos.
 *
 * Los Page Objects se obtienen mediante el fixture compartido
 * definido en pages.fixture.ts.
 */
test.describe('Pantalla de inicio de sesión', () => {
  /**
   * Antes de cada escenario se navega hacia la pantalla de login.
   *
   * Cada prueba utiliza una página aislada proporcionada por Playwright.
   */
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Debe mostrar correctamente la pantalla de inicio de sesión', async ({ page, loginPage }) => {
    // Valida que el usuario se encuentre en la ruta correcta.
    await expect(page).toHaveURL(/\/accounts\/login\/$/);

    // Valida el título mostrado en la pestaña del navegador.
    await expect(page).toHaveTitle('Iniciar sesión | MindCare');

    // Valida los elementos visuales, campos y controles del formulario.
    await loginPage.expectLoginScreenVisible();
  });

  test('Debe iniciar sesión correctamente como administrador', async ({ page, loginPage }) => {
    // Obtiene las credenciales del administrador desde el archivo .env.
    const credentials = getCredentials('ADMIN');

    // Completa el formulario e inicia sesión.
    await loginPage.login(credentials.email, credentials.password);

    // Valida que el usuario haya abandonado la pantalla de login.
    await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

    // Valida la redirección al dashboard correspondiente al administrador.
    await expect(page).toHaveURL(new RegExp(`${routes.dashboards.admin}/?$`));
  });

  test('Debe iniciar sesión correctamente como psicólogo', async ({ page, loginPage }) => {
    // Obtiene las credenciales del psicólogo desde el archivo .env.
    const credentials = getCredentials('PSYCHOLOGIST');

    // Completa el formulario e inicia sesión.
    await loginPage.login(credentials.email, credentials.password);

    // Valida que el usuario haya abandonado la pantalla de login.
    await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

    // Valida la redirección al dashboard correspondiente al psicólogo.
    await expect(page).toHaveURL(new RegExp(`${routes.dashboards.psychologist}/?$`));
  });

  test('Debe iniciar sesión correctamente como paciente', async ({ page, loginPage }) => {
    // Obtiene las credenciales del paciente desde el archivo .env.
    const credentials = getCredentials('PATIENT');

    // Completa el formulario e inicia sesión.
    await loginPage.login(credentials.email, credentials.password);

    // Valida que el usuario haya abandonado la pantalla de login.
    await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

    // Valida la redirección al dashboard correspondiente al paciente.
    await expect(page).toHaveURL(new RegExp(`${routes.dashboards.patient}/?$`));
  });

  test('Debe rechazar credenciales inválidas', async ({ page, loginPage }) => {
    // Intenta iniciar sesión con un usuario inexistente.
    await loginPage.login('usuario.inexistente@correo.com', 'ContraseñaIncorrecta123');

    // Valida que el usuario permanezca en la pantalla de login.
    await expect(page).toHaveURL(/\/accounts\/login\/$/);

    // Valida el mensaje mostrado cuando las credenciales no son correctas.
    await loginPage.expectLoginError('El correo electrónico o la contraseña no son correctos.');
  });

  test('Debe impedir el acceso a un usuario inactivo', async ({ page, loginPage }) => {
    // Obtiene las credenciales de la cuenta inactiva desde el archivo .env.
    const credentials = getCredentials('INACTIVE');

    // Intenta iniciar sesión con la cuenta desactivada.
    await loginPage.login(credentials.email, credentials.password);

    // Valida que el usuario permanezca en la pantalla de login.
    await expect(page).toHaveURL(/\/accounts\/login\/$/);

    // Valida el mensaje específico para cuentas inactivas.
    await loginPage.expectLoginError('Tu cuenta se encuentra inactiva. Comunícate con el administrador del sistema.');
  });
});