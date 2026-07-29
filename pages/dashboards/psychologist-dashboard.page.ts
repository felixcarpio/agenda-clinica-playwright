import { type Locator, type Page } from '@playwright/test';

import { DashboardPage } from './dashboard.page';

/**
 * Page Object del dashboard del psicólogo.
 *
 * Extiende DashboardPage para reutilizar los elementos
 * compartidos del header, sidebar y footer.
 */
export class PsychologistDashboardPage extends DashboardPage {
  // Encabezado del dashboard.
  readonly dashboardHeading: Locator;
  readonly welcomeTitle: Locator;
  readonly welcomeDescription: Locator;

  // Opciones exclusivas del psicólogo en el sidebar.
  readonly agendaLink: Locator;
  readonly agendaText: Locator;
  readonly slotsLink: Locator;
  readonly slotsText: Locator;
  readonly patientsLink: Locator;
  readonly patientsText: Locator;
  readonly sessionNotesLink: Locator;
  readonly sessionNotesText: Locator;
  readonly assignmentsLink: Locator;
  readonly assignmentsText: Locator;

  // Tarjeta de próxima cita.
  readonly nextAppointmentCard: Locator;
  readonly nextAppointmentTitle: Locator;
  readonly nextAppointmentSubtitle: Locator;
  readonly nextAppointmentStatus: Locator;
  readonly nextAppointmentPatient: Locator;
  readonly nextAppointmentDate: Locator;
  readonly nextAppointmentStartTime: Locator;
  readonly nextAppointmentEndTime: Locator;
  readonly nextAppointmentDetailsButton: Locator;
  readonly nextAppointmentEmptyMessage: Locator;
  readonly nextAppointmentEmptyLabel: Locator;

  // Tarjeta de citas de hoy.
  readonly todayAppointmentsCard: Locator;
  readonly todayAppointmentsTitle: Locator;
  readonly todayAppointmentsSubtitle: Locator;
  readonly todayAppointmentsCount: Locator;
  readonly todayAppointmentsSummary: Locator;
  readonly todayNextAppointmentTime: Locator;
  readonly todayNextAppointmentPatient: Locator;
  readonly todayAppointmentsEmptyMessage: Locator;
  readonly agendaButton: Locator;

  // Tarjeta de pacientes atendidos.
  readonly attendedPatientsCard: Locator;
  readonly attendedPatientsTitle: Locator;
  readonly attendedPatientsSubtitle: Locator;
  readonly attendedPatientsCount: Locator;
  readonly patientsButton: Locator;

  // Tarjeta de asignaciones activas.
  readonly activeAssignmentsCard: Locator;
  readonly activeAssignmentsTitle: Locator;
  readonly activeAssignmentsSubtitle: Locator;
  readonly activeAssignmentsCount: Locator;
  readonly latestAssignmentTitle: Locator;
  readonly latestAssignmentPatient: Locator;
  readonly activeAssignmentsEmptyMessage: Locator;
  readonly assignmentsButton: Locator;
  readonly activeAssignmentsEmptyLabel: Locator;

  constructor(page: Page) {
    super(page);

    // Encabezado del dashboard.
    this.dashboardHeading = page.locator('#psychologist-dashboard-heading');
    this.welcomeTitle = page.locator('#psychologist-welcome-title');
    this.welcomeDescription = page.locator(
      '#psychologist-welcome-description'
    );

    // Navegación exclusiva del psicólogo.
    this.agendaLink = page.locator('#sidebar-psychologist-agenda-link');
    this.agendaText = page.locator('#sidebar-psychologist-agenda-text');

    this.slotsLink = page.locator('#sidebar-psychologist-slots-link');
    this.slotsText = page.locator('#sidebar-psychologist-slots-text');

    this.patientsLink = page.locator('#sidebar-psychologist-patients-link');
    this.patientsText = page.locator('#sidebar-psychologist-patients-text');

    this.sessionNotesLink = page.locator(
      '#sidebar-psychologist-session-notes-link'
    );
    this.sessionNotesText = page.locator(
      '#sidebar-psychologist-session-notes-text'
    );

    this.assignmentsLink = page.locator(
      '#sidebar-psychologist-assignments-link'
    );
    this.assignmentsText = page.locator(
      '#sidebar-psychologist-assignments-text'
    );

    // Próxima cita.
    this.nextAppointmentCard = page.locator(
      '#psychologist-next-appointment-card'
    );
    this.nextAppointmentTitle = page.locator(
      '#psychologist-next-appointment-title'
    );
    this.nextAppointmentSubtitle = page.locator(
      '#psychologist-next-appointment-subtitle'
    );
    this.nextAppointmentStatus = page.locator(
      '#psychologist-next-appointment-status'
    );
    this.nextAppointmentPatient = page.locator(
      '#psychologist-next-appointment-patient-value'
    );
    this.nextAppointmentDate = page.locator(
      '#psychologist-next-appointment-date-value'
    );
    this.nextAppointmentStartTime = page.locator(
      '#psychologist-next-appointment-start-time'
    );
    this.nextAppointmentEndTime = page.locator(
      '#psychologist-next-appointment-end-time'
    );
    this.nextAppointmentDetailsButton = page.locator(
      '#psychologist-next-appointment-details-button'
    );
    this.nextAppointmentEmptyMessage = page.locator(
      '#psychologist-next-appointment-empty-message'
    );
    this.nextAppointmentEmptyLabel = page.locator(
      '#psychologist-next-appointment-empty-label'
    );

    // Citas de hoy.
    this.todayAppointmentsCard = page.locator(
      '#psychologist-today-appointments-card'
    );
    this.todayAppointmentsTitle = page.locator(
      '#psychologist-today-appointments-title'
    );
    this.todayAppointmentsSubtitle = page.locator(
      '#psychologist-today-appointments-subtitle'
    );
    this.todayAppointmentsCount = page.locator(
      '#psychologist-today-appointments-count-value'
    );
    this.todayAppointmentsSummary = page.locator(
      '#psychologist-today-appointments-summary'
    );
    this.todayNextAppointmentTime = page.locator(
      '#psychologist-today-next-appointment-time'
    );
    this.todayNextAppointmentPatient = page.locator(
      '#psychologist-today-next-appointment-patient'
    );
    this.todayAppointmentsEmptyMessage = page.locator(
      '#psychologist-today-appointments-empty-message'
    );
    this.agendaButton = page.locator('#psychologist-agenda-button');

    // Pacientes atendidos.
    this.attendedPatientsCard = page.locator(
      '#psychologist-attended-patients-card'
    );
    this.attendedPatientsTitle = page.locator(
      '#psychologist-attended-patients-title'
    );
    this.attendedPatientsSubtitle = page.locator(
      '#psychologist-attended-patients-subtitle'
    );
    this.attendedPatientsCount = page.locator(
      '#psychologist-attended-patients-count'
    );
    this.patientsButton = page.locator('#psychologist-patients-button');

    // Asignaciones activas.
    this.activeAssignmentsCard = page.locator(
      '#psychologist-active-assignments-card'
    );
    this.activeAssignmentsTitle = page.locator(
      '#psychologist-active-assignments-title'
    );
    this.activeAssignmentsSubtitle = page.locator(
      '#psychologist-active-assignments-subtitle'
    );
    this.activeAssignmentsCount = page.locator(
      '#psychologist-active-assignments-count-value'
    );
    this.latestAssignmentTitle = page.locator(
      '#psychologist-latest-assignment-title'
    );
    this.latestAssignmentPatient = page.locator(
      '#psychologist-latest-assignment-patient-value'
    );
    this.activeAssignmentsEmptyMessage = page.locator(
      '#psychologist-active-assignments-empty-message'
    );
    this.assignmentsButton = page.locator(
      '#psychologist-assignments-button'
    );
    this.activeAssignmentsEmptyLabel = page.locator(
      '#psychologist-active-assignments-empty-label'
    );
  }
}