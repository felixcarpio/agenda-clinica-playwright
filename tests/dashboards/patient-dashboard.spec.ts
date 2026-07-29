import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/login.page';
import { PatientDashboardPage } from '../../pages/dashboards/patient-dashboard.page';
import { routes } from '../../utils/routes';

/**
 * Obtiene y valida las credenciales del paciente.
 *
 * @returns Credenciales necesarias para iniciar sesión.
 */
function requirePatientCredentials(): {
  email: string;
  password: string;
} {
  const email = process.env.PATIENT_USER_EMAIL;
  const password = process.env.PATIENT_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Faltan PATIENT_USER_EMAIL o ' +
        'PATIENT_USER_PASSWORD en el archivo .env'
    );
  }

  return { email, password };
}

test.describe('Dashboard del paciente', () => {
  let patientDashboard: PatientDashboardPage;

  /**
   * Antes de cada escenario:
   * 1. Se abre la pantalla de inicio de sesión.
   * 2. Se inicia sesión con un paciente activo.
   * 3. Se crea el Page Object del dashboard.
   * 4. Se valida la redirección al panel del paciente.
   */
  test.beforeEach(async ({ page }) => {
    const credentials = requirePatientCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);

    patientDashboard = new PatientDashboardPage(page);

    await expect(page).toHaveURL(
      new RegExp(`${routes.dashboards.patient}/?$`)
    );
  });

  test(
    'Debe mostrar correctamente la estructura principal',
    async ({ page }) => {
      // Valida el título mostrado en la pestaña del navegador.
      await expect(page).toHaveTitle('Inicio | Agenda Clínica');

      // Valida la estructura general del dashboard.
      await expect(patientDashboard.dashboardLayout).toBeVisible();
      await expect(patientDashboard.sidebar).toBeVisible();
      await expect(patientDashboard.header).toBeVisible();
      await expect(patientDashboard.footer).toBeVisible();

      // Valida la identidad visual del menú lateral.
      await expect(patientDashboard.sidebarLogo).toBeVisible();
      await expect(patientDashboard.sidebarBrandName).toHaveText('MindCare');
      await expect(
        patientDashboard.sidebarBrandSubtitle
      ).toHaveText('Agenda clínica');

      // Valida la información principal del encabezado.
      await expect(
        patientDashboard.headerEyebrow
      ).toHaveText('Agenda clínica');

      await expect(
        patientDashboard.headerTitle
      ).toHaveText('Panel del paciente');

      // Valida la información del usuario autenticado.
      await expect(patientDashboard.userName).toBeVisible();
      await expect(patientDashboard.userRole).toHaveText('Paciente');
      await expect(patientDashboard.userAvatar).toBeVisible();

      // Valida el pie de página.
      await expect(
        patientDashboard.footerCopyright
      ).toContainText('Agenda Clínica Psicológica');

      await expect(
        patientDashboard.footerVersion
      ).toHaveText('Versión 1.0');
    }
  );

  test(
    'Debe mostrar las opciones de navegación del paciente',
    async () => {
      // Opción de inicio.
      await expect(patientDashboard.homeLink).toBeVisible();
      await expect(patientDashboard.homeText).toHaveText('Inicio');

      // Opción de citas.
      await expect(patientDashboard.appointmentsLink).toBeVisible();
      await expect(patientDashboard.appointmentsText).toHaveText('Mis citas');

      // Opción de asignaciones.
      await expect(patientDashboard.assignmentsLink).toBeVisible();
      await expect(
        patientDashboard.assignmentsText
      ).toHaveText('Mis asignaciones');

      // Opción de perfil.
      await expect(patientDashboard.patientProfileLink).toBeVisible();
      await expect(
        patientDashboard.patientProfileText
      ).toHaveText('Mi perfil');
    }
  );

  test(
    'Debe mostrar el encabezado y las tarjetas del paciente',
    async () => {
      // Valida el encabezado propio del dashboard.
      await expect(patientDashboard.welcomeTitle).toBeVisible();
      await expect(patientDashboard.welcomeTitle).toContainText('Clara');

      await expect(
        patientDashboard.welcomeDescription
      ).toHaveText(
        'Consulta tu próxima cita y el resumen de tu actividad.'
      );

      await expect(
        patientDashboard.scheduleAppointmentButton
      ).toBeVisible();

      await expect(
        patientDashboard.scheduleAppointmentButton
      ).toHaveText('Agendar cita');

      // Valida la tarjeta de próxima cita.
      await expect(patientDashboard.nextAppointmentCard).toBeVisible();

      await expect(
        patientDashboard.nextAppointmentTitle
      ).toHaveText('Próxima cita');

      await expect(
        patientDashboard.nextAppointmentSubtitle
      ).toHaveText('Tu siguiente sesión programada.');

      // Valida la tarjeta de asignaciones activas.
      await expect(patientDashboard.activeAssignmentsCard).toBeVisible();

      await expect(
        patientDashboard.activeAssignmentsTitle
      ).toHaveText('Asignaciones activas');

      await expect(
        patientDashboard.activeAssignmentsSubtitle
      ).toHaveText('Actividades pendientes o en progreso.');

      // Valida la tarjeta de perfil.
      await expect(patientDashboard.profileCard).toBeVisible();
      await expect(patientDashboard.profileTitle).toHaveText('Mi perfil');

      await expect(
        patientDashboard.profileSubtitle
      ).toHaveText('Información de tu cuenta.');

      await expect(patientDashboard.profileName).toBeVisible();
      await expect(patientDashboard.profileEmail).toBeVisible();
      await expect(patientDashboard.profileButton).toBeVisible();
      await expect(patientDashboard.profileButton).toHaveText('Ver perfil');
    }
  );
});