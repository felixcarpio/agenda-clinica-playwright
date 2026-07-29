import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/login.page';
import { routes } from '../../utils/routes';

/**
 * Valida que las credenciales necesarias para una prueba
 * estén definidas en las variables de entorno.
 *
 * @param email Correo electrónico obtenido desde el archivo .env.
 * @param password Contraseña obtenida desde el archivo .env.
 * @param userType Tipo de usuario utilizado en la prueba.
 * @returns Credenciales validadas.
 */
function requireCredentials(
  email: string | undefined,
  password: string | undefined,
  userType: string
): { email: string; password: string } {
  if (!email || !password) {
    throw new Error(
      `Faltan las credenciales del usuario ${userType} en el archivo .env`
    );
  }

  return { email, password };
}

test.describe('Pantalla de inicio de sesión', () => {
  let loginPage: LoginPage;

  // Credenciales configuradas en el archivo .env.
  // Se mantienen fuera del código para evitar exponer datos sensibles.
  const adminUserEmail = process.env.ADMIN_USER_EMAIL;
  const adminUserPassword = process.env.ADMIN_USER_PASSWORD;

  const psychologistUserEmail =
    process.env.PSYCHOLOGIST_USER_EMAIL;
  const psychologistUserPassword =
    process.env.PSYCHOLOGIST_USER_PASSWORD;

  const patientUserEmail = process.env.PATIENT_USER_EMAIL;
  const patientUserPassword = process.env.PATIENT_USER_PASSWORD;

  const inactiveUserEmail = process.env.INACTIVE_USER_EMAIL;
  const inactiveUserPassword =
    process.env.INACTIVE_USER_PASSWORD;

  /**
   * Antes de cada escenario:
   * 1. Se crea una instancia de LoginPage.
   * 2. Se navega hacia la pantalla de inicio de sesión.
   *
   * Playwright crea una página aislada para cada prueba.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.goto();
  });

  test(
    'Debe mostrar correctamente la pantalla de inicio de sesión',
    async ({ page }) => {
      // Valida la ruta y el título de la página.
      await expect(page).toHaveURL(/\/accounts\/login\/$/);
      await expect(page).toHaveTitle(
        'Iniciar sesión | MindCare'
      );

      // Valida la identidad visual de la aplicación.
      await expect(loginPage.logo).toBeVisible();

      await expect(loginPage.brandName).toBeVisible();
      await expect(loginPage.brandName).toHaveText('MindCare');

      await expect(loginPage.brandDescription).toBeVisible();
      await expect(loginPage.brandDescription).toHaveText(
        'Sistema de gestión para agenda clínica psicológica.'
      );

      // Valida el encabezado principal del formulario.
      await expect(loginPage.loginTitle).toBeVisible();
      await expect(loginPage.loginTitle).toHaveText(
        'Iniciar sesión'
      );

      await expect(loginPage.loginDescription).toBeVisible();
      await expect(loginPage.loginDescription).toHaveText(
        'Ingresa tus credenciales para acceder al sistema.'
      );

      // Valida el campo de correo electrónico.
      await expect(loginPage.emailLabel).toBeVisible();
      await expect(loginPage.emailLabel).toHaveText(
        'Correo electrónico'
      );

      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.emailInput).toHaveAttribute(
        'type',
        'email'
      );
      await expect(loginPage.emailInput).toHaveAttribute(
        'placeholder',
        'correo@ejemplo.com'
      );

      // Valida el campo de contraseña.
      await expect(loginPage.passwordLabel).toBeVisible();
      await expect(loginPage.passwordLabel).toHaveText(
        'Contraseña'
      );

      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toHaveAttribute(
        'type',
        'password'
      );
      await expect(loginPage.passwordInput).toHaveAttribute(
        'placeholder',
        'Ingresa tu contraseña'
      );

      // Valida el botón de inicio de sesión.
      await expect(loginPage.submitButton).toBeVisible();
      await expect(loginPage.submitButton).toBeEnabled();
      await expect(loginPage.submitButton).toHaveText(
        'Ingresar'
      );

      // Valida el enlace de recuperación de contraseña.
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toHaveText(
        '¿Olvidaste tu contraseña?'
      );

      // Valida el texto informativo del formulario.
      await expect(loginPage.footerText).toBeVisible();
      await expect(loginPage.footerText).toHaveText(
        'Acceso exclusivo para usuarios autorizados.'
      );
    }
  );

  test(
    'Debe iniciar sesión correctamente como administrador',
    async ({ page }) => {
      const credentials = requireCredentials(
        adminUserEmail,
        adminUserPassword,
        'administrador'
      );

      await loginPage.login(
        credentials.email,
        credentials.password
      );

      await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

      await expect(page).toHaveURL(
        new RegExp(`${routes.dashboards.admin}/?$`)
      );
    }
  );

  test(
    'Debe iniciar sesión correctamente como psicólogo',
    async ({ page }) => {
      const credentials = requireCredentials(
        psychologistUserEmail,
        psychologistUserPassword,
        'psicólogo'
      );

      await loginPage.login(
        credentials.email,
        credentials.password
      );

      await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

      await expect(page).toHaveURL(
        new RegExp(`${routes.dashboards.psychologist}/?$`)
      );
    }
  );

  test(
    'Debe iniciar sesión correctamente como paciente',
    async ({ page }) => {
      const credentials = requireCredentials(
        patientUserEmail,
        patientUserPassword,
        'paciente'
      );

      await loginPage.login(
        credentials.email,
        credentials.password
      );

      await expect(page).not.toHaveURL(/\/accounts\/login\/$/);

      await expect(page).toHaveURL(
        new RegExp(`${routes.dashboards.patient}/?$`)
      );
    }
  );

  test(
    'Debe rechazar credenciales inválidas',
    async ({ page }) => {
      // Intenta iniciar sesión con un usuario inexistente.
      await loginPage.login(
        'usuario.inexistente@correo.com',
        'ContraseñaIncorrecta123'
      );

      // El usuario debe permanecer en la pantalla de login.
      await expect(page).toHaveURL(/\/accounts\/login\/$/);

      // Valida el mensaje de error.
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toContainText(
        'El correo electrónico o la contraseña no son correctos.'
      );
    }
  );

  test(
    'Debe impedir el acceso a un usuario inactivo',
    async ({ page }) => {
      const credentials = requireCredentials(
        inactiveUserEmail,
        inactiveUserPassword,
        'inactivo'
      );

      // Intenta iniciar sesión con una cuenta desactivada.
      await loginPage.login(
        credentials.email,
        credentials.password
      );

      // El usuario debe permanecer en la pantalla de login.
      await expect(page).toHaveURL(/\/accounts\/login\/$/);

      // Valida el mensaje específico para cuentas inactivas.
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toContainText(
        'Tu cuenta se encuentra inactiva. ' +
          'Comunícate con el administrador del sistema.'
      );
    }
  );
});