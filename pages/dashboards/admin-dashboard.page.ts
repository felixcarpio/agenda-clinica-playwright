import { type Locator, type Page } from '@playwright/test';

import { DashboardPage } from './dashboard.page';

/**
 * Page Object del dashboard del administrador.
 *
 * Extiende DashboardPage para reutilizar los elementos
 * compartidos del header, sidebar y footer.
 */
export class AdminDashboardPage extends DashboardPage {
  // Encabezado del dashboard.
  readonly dashboardHeading: Locator;
  readonly dashboardTitle: Locator;
  readonly dashboardDescription: Locator;

  // Opciones exclusivas del administrador en el sidebar.
  readonly usersLink: Locator;
  readonly usersText: Locator;
  readonly psychologistsLink: Locator;
  readonly psychologistsText: Locator;
  readonly patientsLink: Locator;
  readonly patientsText: Locator;
  readonly reportsLink: Locator;
  readonly reportsText: Locator;

  // Tarjeta de usuarios.
  readonly usersCard: Locator;
  readonly usersTitle: Locator;
  readonly usersSubtitle: Locator;
  readonly totalUsers: Locator;
  readonly usersDescription: Locator;
  readonly usersButton: Locator;

  // Tarjeta de psicólogos.
  readonly psychologistsCard: Locator;
  readonly psychologistsTitle: Locator;
  readonly psychologistsSubtitle: Locator;
  readonly activePsychologists: Locator;
  readonly psychologistsDescription: Locator;
  readonly psychologistsButton: Locator;

  // Tarjeta de pacientes.
  readonly patientsCard: Locator;
  readonly patientsTitle: Locator;
  readonly patientsSubtitle: Locator;
  readonly activePatients: Locator;
  readonly patientsDescription: Locator;
  readonly patientsButton: Locator;

  // Tarjeta de cuentas inactivas.
  readonly inactiveAccountsCard: Locator;
  readonly inactiveAccountsTitle: Locator;
  readonly inactiveAccountsSubtitle: Locator;
  readonly inactiveAccountsCount: Locator;
  readonly inactiveAccountsDescription: Locator;
  readonly inactiveAccountsButton: Locator;

  // Tarjeta de reportes.
  readonly reportsCard: Locator;
  readonly reportsTitle: Locator;
  readonly reportsSubtitle: Locator;
  readonly totalAppointments: Locator;
  readonly reportsDescription: Locator;
  readonly reportsButton: Locator;

  constructor(page: Page) {
    super(page);

    // Encabezado del dashboard.
    this.dashboardHeading = page.locator('#admin-dashboard-heading');
    this.dashboardTitle = page.locator('#admin-dashboard-title');
    this.dashboardDescription = page.locator('#admin-dashboard-description');

    // Navegación exclusiva del administrador.
    this.usersLink = page.locator('#sidebar-admin-users-link');
    this.usersText = page.locator('#sidebar-admin-users-text');

    this.psychologistsLink = page.locator(
      '#sidebar-admin-psychologists-link'
    );
    this.psychologistsText = page.locator(
      '#sidebar-admin-psychologists-text'
    );

    this.patientsLink = page.locator('#sidebar-admin-patients-link');
    this.patientsText = page.locator('#sidebar-admin-patients-text');

    this.reportsLink = page.locator('#sidebar-admin-reports-link');
    this.reportsText = page.locator('#sidebar-admin-reports-text');

    // Tarjeta de usuarios.
    this.usersCard = page.locator('#admin-users-card');
    this.usersTitle = page.locator('#admin-users-title');
    this.usersSubtitle = page.locator('#admin-users-subtitle');
    this.totalUsers = page.locator('#admin-total-users');
    this.usersDescription = page.locator('#admin-users-description');
    this.usersButton = page.locator('#admin-users-button');

    // Tarjeta de psicólogos.
    this.psychologistsCard = page.locator('#admin-psychologists-card');
    this.psychologistsTitle = page.locator('#admin-psychologists-title');
    this.psychologistsSubtitle = page.locator(
      '#admin-psychologists-subtitle'
    );
    this.activePsychologists = page.locator(
      '#admin-active-psychologists'
    );
    this.psychologistsDescription = page.locator(
      '#admin-psychologists-description'
    );
    this.psychologistsButton = page.locator(
      '#admin-psychologists-button'
    );

    // Tarjeta de pacientes.
    this.patientsCard = page.locator('#admin-patients-card');
    this.patientsTitle = page.locator('#admin-patients-title');
    this.patientsSubtitle = page.locator('#admin-patients-subtitle');
    this.activePatients = page.locator('#admin-active-patients');
    this.patientsDescription = page.locator(
      '#admin-patients-description'
    );
    this.patientsButton = page.locator('#admin-patients-button');

    // Tarjeta de cuentas inactivas.
    this.inactiveAccountsCard = page.locator(
      '#admin-inactive-accounts-card'
    );
    this.inactiveAccountsTitle = page.locator(
      '#admin-inactive-accounts-title'
    );
    this.inactiveAccountsSubtitle = page.locator(
      '#admin-inactive-accounts-subtitle'
    );
    this.inactiveAccountsCount = page.locator(
      '#admin-inactive-accounts-count'
    );
    this.inactiveAccountsDescription = page.locator(
      '#admin-inactive-accounts-description'
    );
    this.inactiveAccountsButton = page.locator(
      '#admin-inactive-accounts-button'
    );

    // Tarjeta de reportes.
    this.reportsCard = page.locator('#admin-reports-card');
    this.reportsTitle = page.locator('#admin-reports-title');
    this.reportsSubtitle = page.locator('#admin-reports-subtitle');
    this.totalAppointments = page.locator('#admin-total-appointments');
    this.reportsDescription = page.locator(
      '#admin-reports-description'
    );
    this.reportsButton = page.locator('#admin-reports-button');
  }
}