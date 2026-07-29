import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/login.page';
import { PsychologistDashboardPage } from '../../pages/dashboards/psychologist-dashboard.page';
import { routes } from '../../utils/routes';

/**
 * Obtiene y valida las credenciales del psicólogo.
 *
 * @returns Credenciales necesarias para iniciar sesión.
 */
function requirePsychologistCredentials(): {
  email: string;
  password: string;
} {
  const email = process.env.PSYCHOLOGIST_USER_EMAIL;
  const password = process.env.PSYCHOLOGIST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Faltan PSYCHOLOGIST_USER_EMAIL o ' +
        'PSYCHOLOGIST_USER_PASSWORD en el archivo .env'
    );
  }

  return { email, password };
}

test.describe('Dashboard del psicólogo', () => {
  let psychologistDashboard: PsychologistDashboardPage;

  /**
   * Antes de cada escenario:
   * 1. Se abre la pantalla de inicio de sesión.
   * 2. Se inicia sesión con un psicólogo activo.
   * 3. Se crea el Page Object del dashboard.
   * 4. Se valida la redirección al panel del psicólogo.
   */
  test.beforeEach(async ({ page }) => {
    const credentials = requirePsychologistCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);

    psychologistDashboard = new PsychologistDashboardPage(page);

    await expect(page).toHaveURL(
      new RegExp(`${routes.dashboards.psychologist}/?$`)
    );
  });

  test(
    'Debe mostrar correctamente la estructura principal',
    async ({ page }) => {
      // Valida el título de la pestaña.
      await expect(page).toHaveTitle('Psicólogo | Agenda Clínica');

      // Valida la estructura compartida del dashboard.
      await expect(psychologistDashboard.dashboardLayout).toBeVisible();
      await expect(psychologistDashboard.sidebar).toBeVisible();
      await expect(psychologistDashboard.header).toBeVisible();
      await expect(psychologistDashboard.footer).toBeVisible();

      // Valida la identidad visual del sidebar.
      await expect(psychologistDashboard.sidebarLogo).toBeVisible();
      await expect(
        psychologistDashboard.sidebarBrandName
      ).toHaveText('MindCare');

      await expect(
        psychologistDashboard.sidebarBrandSubtitle
      ).toHaveText('Agenda clínica');

      // Valida el encabezado general.
      await expect(
        psychologistDashboard.headerEyebrow
      ).toHaveText('Agenda clínica');

      await expect(
        psychologistDashboard.headerTitle
      ).toHaveText('Panel del psicólogo');

      // Valida la información del usuario autenticado.
      await expect(psychologistDashboard.userName).toBeVisible();
      await expect(
        psychologistDashboard.userRole
      ).toHaveText('Psicólogo');

      await expect(psychologistDashboard.userAvatar).toBeVisible();

      // Valida el pie de página.
      await expect(
        psychologistDashboard.footerCopyright
      ).toContainText('Agenda Clínica Psicológica');

      await expect(
        psychologistDashboard.footerVersion
      ).toHaveText('Versión 1.0');
    }
  );

  test(
    'Debe mostrar las opciones de navegación del psicólogo',
    async () => {
      // Opción de inicio.
      await expect(psychologistDashboard.homeLink).toBeVisible();
      await expect(psychologistDashboard.homeText).toHaveText('Inicio');

      // Opción de agenda.
      await expect(psychologistDashboard.agendaLink).toBeVisible();
      await expect(psychologistDashboard.agendaText).toHaveText(
        'Mi agenda'
      );

      // Opción de cupos.
      await expect(psychologistDashboard.slotsLink).toBeVisible();
      await expect(psychologistDashboard.slotsText).toHaveText(
        'Mis cupos'
      );

      // Opción de pacientes.
      await expect(psychologistDashboard.patientsLink).toBeVisible();
      await expect(psychologistDashboard.patientsText).toHaveText(
        'Pacientes'
      );

      // Opción de notas de sesión.
      await expect(
        psychologistDashboard.sessionNotesLink
      ).toBeVisible();

      await expect(
        psychologistDashboard.sessionNotesText
      ).toHaveText('Notas de sesión');

      // Opción de asignaciones.
      await expect(
        psychologistDashboard.assignmentsLink
      ).toBeVisible();

      await expect(
        psychologistDashboard.assignmentsText
      ).toHaveText('Asignaciones');
    }
  );

  test(
    'Debe mostrar el encabezado y las tarjetas del psicólogo',
    async () => {
      // Valida el encabezado del dashboard.
      await expect(
        psychologistDashboard.dashboardHeading
      ).toBeVisible();

      await expect(
        psychologistDashboard.welcomeTitle
      ).toBeVisible();

      await expect(
        psychologistDashboard.welcomeDescription
      ).toHaveText(
        'Consulta tus próximas citas y el resumen de tu actividad clínica.'
      );

      // Tarjeta de próxima cita.
      await expect(
        psychologistDashboard.nextAppointmentCard
      ).toBeVisible();

      await expect(
        psychologistDashboard.nextAppointmentTitle
      ).toHaveText('Próxima cita');

      await expect(
        psychologistDashboard.nextAppointmentSubtitle
      ).toHaveText('Tu siguiente sesión programada.');

      // Tarjeta de citas de hoy.
      await expect(
        psychologistDashboard.todayAppointmentsCard
      ).toBeVisible();

      await expect(
        psychologistDashboard.todayAppointmentsTitle
      ).toHaveText('Citas de hoy');

      await expect(
        psychologistDashboard.todayAppointmentsSubtitle
      ).toHaveText('Sesiones pendientes para este día.');

      await expect(psychologistDashboard.agendaButton).toBeVisible();
      await expect(
        psychologistDashboard.agendaButton
      ).toHaveText('Ver agenda');

      // Tarjeta de pacientes atendidos.
      await expect(
        psychologistDashboard.attendedPatientsCard
      ).toBeVisible();

      await expect(
        psychologistDashboard.attendedPatientsTitle
      ).toHaveText('Pacientes atendidos');

      await expect(
        psychologistDashboard.attendedPatientsSubtitle
      ).toHaveText('Pacientes con sesiones completadas.');

      await expect(
        psychologistDashboard.attendedPatientsCount
      ).toBeVisible();

      await expect(
        psychologistDashboard.patientsButton
      ).toHaveText('Ver pacientes');

      // Tarjeta de asignaciones activas.
      await expect(
        psychologistDashboard.activeAssignmentsCard
      ).toBeVisible();

      await expect(
        psychologistDashboard.activeAssignmentsTitle
      ).toHaveText('Asignaciones activas');

      await expect(
        psychologistDashboard.activeAssignmentsSubtitle
      ).toHaveText('Actividades pendientes o en progreso.');
    }
  );
});