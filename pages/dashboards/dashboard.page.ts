import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object base para las pantallas autenticadas.
 *
 * Centraliza los elementos compartidos por los dashboards
 * de administrador, psicólogo y paciente:
 *
 * - Encabezado.
 * - Menú lateral.
 * - Información del usuario.
 * - Menú desplegable del usuario.
 * - Pie de página.
 */
export class DashboardPage {
  readonly page: Page;

  // Estructura principal del dashboard.
  readonly dashboardLayout: Locator;
  readonly dashboardMain: Locator;
  readonly pageContent: Locator;
  readonly contentContainer: Locator;

  // Identidad visual del menú lateral.
  readonly sidebar: Locator;
  readonly sidebarLogo: Locator;
  readonly sidebarBrandName: Locator;
  readonly sidebarBrandSubtitle: Locator;

  // Navegación compartida.
  readonly homeLink: Locator;
  readonly homeText: Locator;
  readonly appointmentsText: Locator;
  readonly assignmentsText: Locator;
  readonly patientProfileText: Locator;

  // Encabezado de la aplicación.
  readonly header: Locator;
  readonly headerEyebrow: Locator;
  readonly headerTitle: Locator;

  // Información del usuario autenticado.
  readonly userName: Locator;
  readonly userRole: Locator;
  readonly userAvatar: Locator;

  // Menú desplegable del usuario.
  readonly userMenuToggle: Locator;
  readonly userMenuDropdown: Locator;
  readonly dropdownUserName: Locator;
  readonly dropdownUserEmail: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  // Pie de página.
  readonly footer: Locator;
  readonly footerCopyright: Locator;
  readonly footerVersion: Locator;

  constructor(page: Page) {
    this.page = page;

    // Estructura principal.
    this.dashboardLayout = page.locator('#dashboard-layout');
    this.dashboardMain = page.locator('#dashboard-main');
    this.pageContent = page.locator(
      '#dashboard-page-content'
    );
    this.contentContainer = page.locator(
      '#dashboard-content-container'
    );

    // Menú lateral.
    this.sidebar = page.locator('#app-sidebar');
    this.sidebarLogo = page.locator('#sidebar-logo');
    this.sidebarBrandName = page.locator(
      '#sidebar-brand-name'
    );
    this.sidebarBrandSubtitle = page.locator(
      '#sidebar-brand-subtitle'
    );

    // Navegación compartida.
    this.homeLink = page.locator('#sidebar-home-link');
    this.homeText = page.locator('#sidebar-home-text');
    this.appointmentsText = page.locator('#sidebar-patient-appointments-text');
    this.assignmentsText = page.locator('#sidebar-patient-assignments-text');
    this.patientProfileText = page.locator('#sidebar-patient-profile-text');

    // Encabezado.
    this.header = page.locator('#app-header');
    this.headerEyebrow = page.locator(
      '#app-header-eyebrow'
    );
    this.headerTitle = page.locator('#app-header-title');

    // Información del usuario.
    this.userName = page.locator('#header-user-name');
    this.userRole = page.locator('#header-user-role');
    this.userAvatar = page.locator('#header-user-avatar');

    // Menú desplegable.
    this.userMenuToggle = page.locator('#user-menu-toggle');
    this.userMenuDropdown = page.locator(
      '#user-menu-dropdown'
    );
    this.dropdownUserName = page.locator(
      '#user-menu-dropdown-name'
    );
    this.dropdownUserEmail = page.locator(
      '#user-menu-dropdown-email'
    );
    this.profileLink = page.locator(
      '#user-menu-profile-link'
    );
    this.logoutButton = page.locator('#logout-button');

    // Pie de página.
    this.footer = page.locator('#app-footer');
    this.footerCopyright = page.locator(
      '#app-footer-copyright'
    );
    this.footerVersion = page.locator(
      '#app-footer-version'
    );
  }

  /**
   * Abre el menú desplegable del usuario autenticado.
   */
  async openUserMenu(): Promise<void> {
    await this.userMenuToggle.click();
  }

  /**
   * Abre el menú del usuario y cierra la sesión activa.
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
  }
}