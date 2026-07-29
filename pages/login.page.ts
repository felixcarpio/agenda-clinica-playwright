import { type Locator, type Page } from '@playwright/test';

import { routes } from '../utils/routes';

/**
 * Page Object de la pantalla de inicio de sesión.
 *
 * Centraliza:
 * - Los locators de los elementos de la pantalla.
 * - La navegación hacia el login.
 * - Las acciones reutilizables del formulario.
 */
export class LoginPage {
  readonly page: Page;

  // Identidad visual de la aplicación.
  readonly logo: Locator;
  readonly brandName: Locator;
  readonly brandDescription: Locator;

  // Encabezado principal del formulario.
  readonly loginTitle: Locator;
  readonly loginDescription: Locator;

  // Etiquetas de los campos.
  readonly emailLabel: Locator;
  readonly passwordLabel: Locator;

  // Campos de credenciales.
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  // Controles y textos adicionales del formulario.
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly footerText: Locator;

  // Mensaje general mostrado cuando el inicio de sesión falla.
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Identidad visual.
    this.logo = page.locator('#auth-logo');
    this.brandName = page.locator('#auth-brand-name');
    this.brandDescription = page.locator(
      '#auth-brand-description'
    );

    // Encabezado del formulario.
    this.loginTitle = page.locator('#login-title');
    this.loginDescription = page.locator(
      '#login-description'
    );

    // Etiquetas de los campos.
    this.emailLabel = page.locator('#email-label');
    this.passwordLabel = page.locator('#password-label');

    // Campos de credenciales.
    this.emailInput = page.locator('#email-input');
    this.passwordInput = page.locator('#password-input');

    // Controles adicionales del formulario.
    this.submitButton = page.locator(
      '#login-submit-button'
    );
    this.forgotPasswordLink = page.locator(
      '#forgot-password-link'
    );
    this.footerText = page.locator('#login-footer-text');

    // Mensaje general de error.
    this.loginError = page.locator('#login-general-error');
  }

  /**
   * Navega hacia la pantalla de inicio de sesión.
   */
  async goto(): Promise<void> {
    await this.page.goto(routes.login);
  }

  /**
   * Completa el formulario e intenta iniciar sesión.
   *
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   */
  async login(
    email: string,
    password: string
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}