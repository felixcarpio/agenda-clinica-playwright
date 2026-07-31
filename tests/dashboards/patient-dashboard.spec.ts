import { test, expect } from '../../fixtures/pages.fixture';

import { loginAs } from '../../helpers/auth.helper';

/**
 * Pruebas automatizadas del dashboard del paciente.
 *
 * Este archivo valida:
 * - La estructura compartida de las pantallas autenticadas.
 * - Las opciones de navegación exclusivas del paciente.
 * - El encabezado y las tarjetas informativas del paciente.
 */
test.describe('Dashboard del paciente', () => {
  /**
   * Antes de cada escenario se inicia sesión con un paciente activo.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PATIENT');
  });

  test('Debe mostrar correctamente la estructura principal', async ({ page, patientDashboardPage }) => {
    // Valida el título mostrado en la pestaña del navegador.
    await expect(page).toHaveTitle('Inicio | Agenda Clínica');

    // Valida la estructura, identidad visual, usuario y pie de página compartidos.
    await patientDashboardPage.expectCommonStructure('Panel del paciente', 'Paciente');
  });

  test('Debe mostrar las opciones de navegación del paciente', async ({ patientDashboardPage }) => {
    // Valida la opción compartida de inicio.
    await expect(patientDashboardPage.homeLink).toBeVisible();
    await expect(patientDashboardPage.homeText).toHaveText('Inicio');

    // Valida la opción de citas.
    await expect(patientDashboardPage.appointmentsLink).toBeVisible();
    await expect(patientDashboardPage.appointmentsText).toHaveText('Mis citas');

    // Valida la opción de asignaciones.
    await expect(patientDashboardPage.assignmentsLink).toBeVisible();
    await expect(patientDashboardPage.assignmentsText).toHaveText('Mis asignaciones');

    // Valida la opción de perfil.
    await expect(patientDashboardPage.patientProfileLink).toBeVisible();
    await expect(patientDashboardPage.patientProfileText).toHaveText('Mi perfil');
  });

  test('Debe mostrar el encabezado y las tarjetas del paciente', async ({ patientDashboardPage }) => {
    // Valida el encabezado propio del dashboard.
    await expect(patientDashboardPage.welcomeTitle).toBeVisible();
    await expect(patientDashboardPage.welcomeTitle).toContainText('Clara');
    await expect(patientDashboardPage.welcomeDescription).toHaveText('Consulta tu próxima cita y el resumen de tu actividad.');
    await expect(patientDashboardPage.scheduleAppointmentButton).toBeVisible();
    await expect(patientDashboardPage.scheduleAppointmentButton).toHaveText('Agendar cita');

    // Valida la tarjeta de próxima cita.
    await expect(patientDashboardPage.nextAppointmentCard).toBeVisible();
    await expect(patientDashboardPage.nextAppointmentTitle).toHaveText('Próxima cita');
    await expect(patientDashboardPage.nextAppointmentSubtitle).toHaveText('Tu siguiente sesión programada.');

    // Valida la tarjeta de asignaciones activas.
    await expect(patientDashboardPage.activeAssignmentsCard).toBeVisible();
    await expect(patientDashboardPage.activeAssignmentsTitle).toHaveText('Asignaciones activas');
    await expect(patientDashboardPage.activeAssignmentsSubtitle).toHaveText('Actividades pendientes o en progreso.');

    // Valida la tarjeta de perfil.
    await expect(patientDashboardPage.profileCard).toBeVisible();
    await expect(patientDashboardPage.profileTitle).toHaveText('Mi perfil');
    await expect(patientDashboardPage.profileSubtitle).toHaveText('Información de tu cuenta.');
    await expect(patientDashboardPage.profileName).toBeVisible();
    await expect(patientDashboardPage.profileEmail).toBeVisible();
    await expect(patientDashboardPage.profileButton).toBeVisible();
    await expect(patientDashboardPage.profileButton).toHaveText('Ver perfil');
  });
});