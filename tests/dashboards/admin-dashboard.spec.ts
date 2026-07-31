import { test, expect } from '../../fixtures/pages.fixture';

import { loginAs } from '../../helpers/auth.helper';

/**
 * Pruebas automatizadas del dashboard del administrador.
 *
 * Este archivo valida:
 * - La estructura compartida de las pantallas autenticadas.
 * - Las opciones de navegación exclusivas del administrador.
 * - El encabezado y las tarjetas administrativas.
 */
test.describe('Dashboard del administrador', () => {
  /**
   * Antes de cada escenario se inicia sesión con un administrador activo.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'ADMIN');
  });

  test('Debe mostrar correctamente la estructura principal', async ({ page, adminDashboardPage }) => {
    // Valida el título mostrado en la pestaña del navegador.
    await expect(page).toHaveTitle('Administración | Agenda Clínica');

    // Valida la estructura, identidad visual, usuario y pie de página compartidos.
    await adminDashboardPage.expectCommonStructure('Panel de administración', 'Administrador');
  });

  test('Debe mostrar las opciones de navegación del administrador', async ({ adminDashboardPage }) => {
    // Valida la opción compartida de inicio.
    await expect(adminDashboardPage.homeLink).toBeVisible();
    await expect(adminDashboardPage.homeText).toHaveText('Inicio');

    // Valida la opción de usuarios.
    await expect(adminDashboardPage.usersLink).toBeVisible();
    await expect(adminDashboardPage.usersText).toHaveText('Usuarios');

    // Valida la opción de psicólogos.
    await expect(adminDashboardPage.psychologistsLink).toBeVisible();
    await expect(adminDashboardPage.psychologistsText).toHaveText('Psicólogos');

    // Valida la opción de pacientes.
    await expect(adminDashboardPage.patientsLink).toBeVisible();
    await expect(adminDashboardPage.patientsText).toHaveText('Pacientes');

    // Valida la opción de reportes.
    await expect(adminDashboardPage.reportsLink).toBeVisible();
    await expect(adminDashboardPage.reportsText).toHaveText('Reportes');
  });

  test('Debe mostrar el encabezado y las tarjetas administrativas', async ({ adminDashboardPage }) => {
    // Valida el encabezado propio del dashboard.
    await expect(adminDashboardPage.dashboardHeading).toBeVisible();
    await expect(adminDashboardPage.dashboardTitle).toHaveText('Panel de administración');
    await expect(adminDashboardPage.dashboardDescription).toContainText('Consulta el estado general de las cuentas');

    // Valida la tarjeta de usuarios.
    await expect(adminDashboardPage.usersCard).toBeVisible();
    await expect(adminDashboardPage.usersTitle).toHaveText('Usuarios');
    await expect(adminDashboardPage.usersSubtitle).toHaveText('Total de cuentas registradas');
    await expect(adminDashboardPage.totalUsers).toBeVisible();
    await expect(adminDashboardPage.usersButton).toHaveText('Ver usuarios');

    // Valida la tarjeta de psicólogos.
    await expect(adminDashboardPage.psychologistsCard).toBeVisible();
    await expect(adminDashboardPage.psychologistsTitle).toHaveText('Psicólogos');
    await expect(adminDashboardPage.activePsychologists).toBeVisible();
    await expect(adminDashboardPage.psychologistsButton).toHaveText('Ver psicólogos');

    // Valida la tarjeta de pacientes.
    await expect(adminDashboardPage.patientsCard).toBeVisible();
    await expect(adminDashboardPage.patientsTitle).toHaveText('Pacientes');
    await expect(adminDashboardPage.activePatients).toBeVisible();
    await expect(adminDashboardPage.patientsButton).toHaveText('Ver pacientes');

    // Valida la tarjeta de cuentas inactivas.
    await expect(adminDashboardPage.inactiveAccountsCard).toBeVisible();
    await expect(adminDashboardPage.inactiveAccountsTitle).toHaveText('Cuentas inactivas');
    await expect(adminDashboardPage.inactiveAccountsCount).toBeVisible();
    await expect(adminDashboardPage.inactiveAccountsButton).toHaveText('Ver cuentas inactivas');

    // Valida la tarjeta de reportes.
    await expect(adminDashboardPage.reportsCard).toBeVisible();
    await expect(adminDashboardPage.reportsTitle).toHaveText('Reportes');
    await expect(adminDashboardPage.totalAppointments).toBeVisible();
    await expect(adminDashboardPage.reportsButton).toHaveText('Ver reportes');
  });
});