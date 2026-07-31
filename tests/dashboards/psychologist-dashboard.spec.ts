import { test, expect } from '../../fixtures/pages.fixture';

import { loginAs } from '../../helpers/auth.helper';

/**
 * Pruebas automatizadas del dashboard del psicólogo.
 *
 * Este archivo valida:
 * - La estructura compartida de las pantallas autenticadas.
 * - Las opciones de navegación exclusivas del psicólogo.
 * - El encabezado y las tarjetas de actividad clínica.
 */
test.describe('Dashboard del psicólogo', () => {
  /**
   * Antes de cada escenario se inicia sesión con un psicólogo activo.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PSYCHOLOGIST');
  });

  test('Debe mostrar correctamente la estructura principal', async ({ page, psychologistDashboardPage }) => {
    // Valida el título mostrado en la pestaña del navegador.
    await expect(page).toHaveTitle('Psicólogo | Agenda Clínica');

    // Valida la estructura, identidad visual, usuario y pie de página compartidos.
    await psychologistDashboardPage.expectCommonStructure('Panel del psicólogo', 'Psicólogo');
  });

  test('Debe mostrar las opciones de navegación del psicólogo', async ({ psychologistDashboardPage }) => {
    // Valida la opción compartida de inicio.
    await expect(psychologistDashboardPage.homeLink).toBeVisible();
    await expect(psychologistDashboardPage.homeText).toHaveText('Inicio');

    // Valida la opción de agenda.
    await expect(psychologistDashboardPage.agendaLink).toBeVisible();
    await expect(psychologistDashboardPage.agendaText).toHaveText('Mi agenda');

    // Valida la opción de cupos.
    await expect(psychologistDashboardPage.slotsLink).toBeVisible();
    await expect(psychologistDashboardPage.slotsText).toHaveText('Mis cupos');

    // Valida la opción de pacientes.
    await expect(psychologistDashboardPage.patientsLink).toBeVisible();
    await expect(psychologistDashboardPage.patientsText).toHaveText('Pacientes');

    // Valida la opción de notas de sesión.
    await expect(psychologistDashboardPage.sessionNotesLink).toBeVisible();
    await expect(psychologistDashboardPage.sessionNotesText).toHaveText('Notas de sesión');

    // Valida la opción de asignaciones.
    await expect(psychologistDashboardPage.assignmentsLink).toBeVisible();
    await expect(psychologistDashboardPage.assignmentsText).toHaveText('Asignaciones');
  });

  test('Debe mostrar el encabezado y las tarjetas del psicólogo', async ({ psychologistDashboardPage }) => {
    // Valida el encabezado propio del dashboard.
    await expect(psychologistDashboardPage.dashboardHeading).toBeVisible();
    await expect(psychologistDashboardPage.welcomeTitle).toBeVisible();
    await expect(psychologistDashboardPage.welcomeDescription).toHaveText('Consulta tus próximas citas y el resumen de tu actividad clínica.');

    // Valida la tarjeta de próxima cita.
    await expect(psychologistDashboardPage.nextAppointmentCard).toBeVisible();
    await expect(psychologistDashboardPage.nextAppointmentTitle).toHaveText('Próxima cita');
    await expect(psychologistDashboardPage.nextAppointmentSubtitle).toHaveText('Tu siguiente sesión programada.');

    // Valida la tarjeta de citas de hoy.
    await expect(psychologistDashboardPage.todayAppointmentsCard).toBeVisible();
    await expect(psychologistDashboardPage.todayAppointmentsTitle).toHaveText('Citas de hoy');
    await expect(psychologistDashboardPage.todayAppointmentsSubtitle).toHaveText('Sesiones pendientes para este día.');
    await expect(psychologistDashboardPage.agendaButton).toBeVisible();
    await expect(psychologistDashboardPage.agendaButton).toHaveText('Ver agenda');

    // Valida la tarjeta de pacientes atendidos.
    await expect(psychologistDashboardPage.attendedPatientsCard).toBeVisible();
    await expect(psychologistDashboardPage.attendedPatientsTitle).toHaveText('Pacientes atendidos');
    await expect(psychologistDashboardPage.attendedPatientsSubtitle).toHaveText('Pacientes con sesiones completadas.');
    await expect(psychologistDashboardPage.attendedPatientsCount).toBeVisible();
    await expect(psychologistDashboardPage.patientsButton).toHaveText('Ver pacientes');

    // Valida la tarjeta de asignaciones activas.
    await expect(psychologistDashboardPage.activeAssignmentsCard).toBeVisible();
    await expect(psychologistDashboardPage.activeAssignmentsTitle).toHaveText('Asignaciones activas');
    await expect(psychologistDashboardPage.activeAssignmentsSubtitle).toHaveText('Actividades pendientes o en progreso.');
  });
});