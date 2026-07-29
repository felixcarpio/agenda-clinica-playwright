import { type Locator, type Page } from '@playwright/test';

import { DashboardPage } from './dashboard.page';

/**
 * Page Object del dashboard del paciente.
 *
 * Extiende DashboardPage para reutilizar los elementos
 * compartidos del header, sidebar y footer.
 */
export class PatientDashboardPage extends DashboardPage {
  // Encabezado del dashboard del paciente.
  readonly dashboardHeading: Locator;
  readonly welcomeTitle: Locator;
  readonly welcomeDescription: Locator;
  readonly scheduleAppointmentButton: Locator;

  // Opciones exclusivas del paciente en el sidebar.
  readonly appointmentsLink: Locator;
  readonly assignmentsLink: Locator;
  readonly patientProfileLink: Locator;

  // Tarjeta de próxima cita.
  readonly nextAppointmentCard: Locator;
  readonly nextAppointmentTitle: Locator;
  readonly nextAppointmentSubtitle: Locator;
  readonly nextAppointmentStatus: Locator;
  readonly nextAppointmentPsychologist: Locator;
  readonly nextAppointmentDate: Locator;
  readonly nextAppointmentStartTime: Locator;
  readonly nextAppointmentEndTime: Locator;
  readonly nextAppointmentDetailsButton: Locator;
  readonly nextAppointmentEmptyMessage: Locator;
  readonly nextAppointmentEmptyAction: Locator;

  // Tarjeta de asignaciones.
  readonly activeAssignmentsCard: Locator;
  readonly activeAssignmentsTitle: Locator;
  readonly activeAssignmentsSubtitle: Locator;
  readonly activeAssignmentsCount: Locator;
  readonly latestAssignmentTitle: Locator;
  readonly latestAssignmentDescription: Locator;
  readonly latestAssignmentStatus: Locator;
  readonly activeAssignmentsEmptyMessage: Locator;
  readonly assignmentDetailsButton: Locator;
  readonly assignmentsListButton: Locator;

  // Tarjeta de perfil.
  readonly profileCard: Locator;
  readonly profileTitle: Locator;
  readonly profileSubtitle: Locator;
  readonly profileName: Locator;
  readonly profileEmail: Locator;
  readonly profileButton: Locator;

  constructor(page: Page) {
    super(page);

    // Encabezado del dashboard.
    this.dashboardHeading = page.locator('#patient-dashboard-heading');
    this.welcomeTitle = page.locator('#patient-welcome-title');
    this.welcomeDescription = page.locator('#patient-welcome-description');
    this.scheduleAppointmentButton = page.locator(
      '#patient-schedule-appointment-button'
    );

    // Navegación exclusiva del paciente.
    this.appointmentsLink = page.locator(
      '#sidebar-patient-appointments-link'
    );
    this.assignmentsLink = page.locator(
      '#sidebar-patient-assignments-link'
    );
    this.patientProfileLink = page.locator(
      '#sidebar-patient-profile-link'
    );

    // Próxima cita.
    this.nextAppointmentCard = page.locator('#next-appointment-card');
    this.nextAppointmentTitle = page.locator('#next-appointment-title');
    this.nextAppointmentSubtitle = page.locator(
      '#next-appointment-subtitle'
    );
    this.nextAppointmentStatus = page.locator('#next-appointment-status');
    this.nextAppointmentPsychologist = page.locator(
      '#next-appointment-psychologist-value'
    );
    this.nextAppointmentDate = page.locator(
      '#next-appointment-date-value'
    );
    this.nextAppointmentStartTime = page.locator(
      '#next-appointment-start-time'
    );
    this.nextAppointmentEndTime = page.locator(
      '#next-appointment-end-time'
    );
    this.nextAppointmentDetailsButton = page.locator(
      '#next-appointment-details-button'
    );
    this.nextAppointmentEmptyMessage = page.locator(
      '#next-appointment-empty-message'
    );
    this.nextAppointmentEmptyAction = page.locator(
      '#next-appointment-empty-action'
    );

    // Asignaciones activas.
    this.activeAssignmentsCard = page.locator('#active-assignments-card');
    this.activeAssignmentsTitle = page.locator(
      '#active-assignments-title'
    );
    this.activeAssignmentsSubtitle = page.locator(
      '#active-assignments-subtitle'
    );
    this.activeAssignmentsCount = page.locator(
      '#active-assignments-count'
    );
    this.latestAssignmentTitle = page.locator(
      '#latest-assignment-title'
    );
    this.latestAssignmentDescription = page.locator(
      '#latest-assignment-description'
    );
    this.latestAssignmentStatus = page.locator(
      '#latest-assignment-status-value'
    );
    this.activeAssignmentsEmptyMessage = page.locator(
      '#active-assignments-empty-message'
    );
    this.assignmentDetailsButton = page.locator(
      '#latest-assignment-details-button'
    );
    this.assignmentsListButton = page.locator(
      '#active-assignments-list-button'
    );

    // Perfil del paciente.
    this.profileCard = page.locator('#patient-profile-card');
    this.profileTitle = page.locator('#patient-profile-title');
    this.profileSubtitle = page.locator('#patient-profile-subtitle');
    this.profileName = page.locator('#patient-profile-name-value');
    this.profileEmail = page.locator('#patient-profile-email-value');
    this.profileButton = page.locator('#patient-profile-button');
  }
}