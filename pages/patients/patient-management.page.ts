import { expect, type Locator, type Page } from '@playwright/test';

import { DashboardPage } from '../dashboards/dashboard.page';

/**
 * Estados de atención que puede administrar el psicólogo.
 *
 * Estos valores coinciden con los valores almacenados
 * por PatientPsychologistRelationship en el backend.
 */
export type PatientRelationshipStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DISCHARGED';

/**
 * Datos utilizados para registrar un paciente.
 *
 * Los campos opcionales pueden omitirse en escenarios que solamente
 * necesiten completar la información obligatoria.
 */
export interface PatientCreateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  chiefComplaint?: string;
}

/**
 * Datos que el psicólogo puede modificar desde la edición.
 *
 * El correo no se incluye porque solamente el administrador
 * puede gestionar ese dato.
 */
export interface PatientUpdateData {
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

/**
 * Page Object para la gestión de pacientes del psicólogo.
 *
 * Centraliza los locators, acciones y validaciones de:
 *
 * - Listado de pacientes.
 * - Búsqueda y filtros por estado.
 * - Creación de pacientes.
 * - Pantalla de credenciales temporales.
 * - Detalle del paciente.
 * - Edición de información.
 * - Actualización del estado de atención.
 */
export class PatientManagementPage extends DashboardPage {
  // Navegación general.
  readonly patientsLink: Locator;

  // Encabezado del listado.
  readonly listHeading: Locator;
  readonly listTitle: Locator;
  readonly listDescription: Locator;
  readonly createPatientLink: Locator;

  // Tarjeta principal del listado.
  readonly listCard: Locator;
  readonly listCardTitle: Locator;
  readonly listCardSubtitle: Locator;
  readonly filteredPatientsCount: Locator;

  // Filtros del listado.
  readonly statusFilters: Locator;
  readonly allPatientsFilter: Locator;
  readonly activePatientsFilter: Locator;
  readonly inactivePatientsFilter: Locator;
  readonly dischargedPatientsFilter: Locator;
  readonly allPatientsCount: Locator;
  readonly activePatientsCount: Locator;
  readonly inactivePatientsCount: Locator;
  readonly dischargedPatientsCount: Locator;

  // Buscador.
  readonly searchForm: Locator;
  readonly searchInput: Locator;
  readonly searchStatus: Locator;

  // Tabla de pacientes.
  readonly patientTableWrapper: Locator;
  readonly patientTable: Locator;
  readonly patientTableBody: Locator;

  // Estado vacío.
  readonly emptyState: Locator;
  readonly emptyStateTitle: Locator;
  readonly emptyStateDescription: Locator;
  readonly emptySearchQuery: Locator;

  // Paginación.
  readonly pagination: Locator;
  readonly paginationSummary: Locator;
  readonly previousPageLink: Locator;
  readonly nextPageLink: Locator;

  // Pantalla de creación.
  readonly createHeading: Locator;
  readonly createTitle: Locator;
  readonly createDescription: Locator;
  readonly createBackLink: Locator;
  readonly createForm: Locator;

  // Secciones del formulario de creación.
  readonly createAccessCard: Locator;
  readonly createAccessTitle: Locator;
  readonly createPersonalCard: Locator;
  readonly createPersonalTitle: Locator;
  readonly createEmergencyCard: Locator;
  readonly createEmergencyTitle: Locator;
  readonly createClinicalCard: Locator;
  readonly createClinicalTitle: Locator;

  // Campos compartidos por creación y edición.
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly birthDateInput: Locator;
  readonly genderSelect: Locator;
  readonly addressInput: Locator;
  readonly emergencyContactNameInput: Locator;
  readonly emergencyContactPhoneInput: Locator;
  readonly chiefComplaintInput: Locator;

  // Acciones del formulario de creación.
  readonly createCancelLink: Locator;
  readonly createSubmitButton: Locator;

  // Errores de creación.
  readonly createFirstNameError: Locator;
  readonly createLastNameError: Locator;
  readonly createEmailError: Locator;
  readonly createBirthDateError: Locator;
  readonly createEmergencyNameError: Locator;
  readonly createEmergencyPhoneError: Locator;

  // Pantalla de paciente registrado.
  readonly createdHeading: Locator;
  readonly createdTitle: Locator;
  readonly createdDescription: Locator;
  readonly createdCard: Locator;
  readonly createdPatientName: Locator;
  readonly createdInstructions: Locator;
  readonly createdEmail: Locator;
  readonly createdPassword: Locator;
  readonly copyEmailButton: Locator;
  readonly copyPasswordButton: Locator;
  readonly createdWarning: Locator;
  readonly createdBackLink: Locator;
  readonly createdDetailLink: Locator;

  // Detalle del paciente.
  readonly detailHeading: Locator;
  readonly detailTitle: Locator;
  readonly detailDescription: Locator;
  readonly detailContainer: Locator;
  readonly editPatientLink: Locator;
  readonly clinicalRecordLink: Locator;
  readonly detailBackLink: Locator;

  // Información general del paciente.
  readonly profileCard: Locator;
  readonly profileName: Locator;
  readonly profileStatus: Locator;
  readonly patientEmailValue: Locator;
  readonly patientPhoneValue: Locator;
  readonly patientBirthDateValue: Locator;
  readonly patientGenderValue: Locator;
  readonly patientStartDateValue: Locator;
  readonly patientEndDateValue: Locator;
  readonly patientAddressValue: Locator;
  readonly patientEmergencyNameValue: Locator;
  readonly patientEmergencyPhoneValue: Locator;

  // Administración del estado de atención.
  readonly statusCard: Locator;
  readonly statusTitle: Locator;
  readonly statusSubtitle: Locator;
  readonly currentStatusBadge: Locator;
  readonly statusForm: Locator;
  readonly statusSelect: Locator;
  readonly statusSubmitButton: Locator;

  // Información de ayuda sobre los estados.
  readonly statusHelp: Locator;
  readonly activeStatusHelp: Locator;
  readonly inactiveStatusHelp: Locator;
  readonly dischargedStatusHelp: Locator;

  // Citas mostradas en el detalle.
  readonly upcomingAppointmentsCard: Locator;
  readonly upcomingAppointmentsTitle: Locator;
  readonly upcomingAppointmentsEmpty: Locator;
  readonly completedAppointmentsCard: Locator;
  readonly completedAppointmentsTitle: Locator;
  readonly completedAppointmentsEmpty: Locator;

  // Pantalla de edición.
  readonly editHeading: Locator;
  readonly editTitle: Locator;
  readonly editDescription: Locator;
  readonly editBackLink: Locator;
  readonly editCard: Locator;
  readonly editPatientName: Locator;
  readonly editStatus: Locator;
  readonly editForm: Locator;
  readonly editPersonalSection: Locator;
  readonly editPersonalTitle: Locator;
  readonly editEmergencySection: Locator;
  readonly editEmergencyTitle: Locator;
  readonly editCancelLink: Locator;
  readonly editSubmitButton: Locator;

  // Mensajes generales del sistema.
  readonly systemMessages: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    /**
     * Navegación.
     *
     * Este ID debe coincidir con el enlace de pacientes ubicado
     * en el sidebar del psicólogo.
     */
    this.patientsLink = page.locator('#sidebar-psychologist-patients-link');

    // Encabezado del listado.
    this.listHeading = page.locator('#psychologist-patient-list-heading');
    this.listTitle = page.locator('#psychologist-patient-list-title');
    this.listDescription = page.locator('#psychologist-patient-list-description');
    this.createPatientLink = page.locator('#psychologist-patient-create-link');

    // Tarjeta principal.
    this.listCard = page.locator('#psychologist-patient-list-card');
    this.listCardTitle = page.locator('#psychologist-patient-list-card-title');
    this.listCardSubtitle = page.locator('#psychologist-patient-list-card-subtitle');
    this.filteredPatientsCount = page.locator('#psychologist-patient-filtered-count');

    // Filtros.
    this.statusFilters = page.locator('#psychologist-patient-status-filters');
    this.allPatientsFilter = page.locator('#psychologist-patient-filter-all');
    this.activePatientsFilter = page.locator('#psychologist-patient-filter-active');
    this.inactivePatientsFilter = page.locator('#psychologist-patient-filter-inactive');
    this.dischargedPatientsFilter = page.locator('#psychologist-patient-filter-discharged');
    this.allPatientsCount = page.locator('#psychologist-patient-filter-all-count');
    this.activePatientsCount = page.locator('#psychologist-patient-filter-active-count');
    this.inactivePatientsCount = page.locator('#psychologist-patient-filter-inactive-count');
    this.dischargedPatientsCount = page.locator('#psychologist-patient-filter-discharged-count');

    // Buscador.
    this.searchForm = page.locator('#patient-search-form');
    this.searchInput = page.locator('#patient-search-input');
    this.searchStatus = page.locator('#patient-search-status');

    // Tabla.
    this.patientTableWrapper = page.locator('#psychologist-patient-table-wrapper');
    this.patientTable = page.locator('#psychologist-patient-table');
    this.patientTableBody = page.locator('#psychologist-patient-table-body');

    // Estado vacío.
    this.emptyState = page.locator('#psychologist-patient-list-empty');
    this.emptyStateTitle = page.locator('#psychologist-patient-empty-title');
    this.emptyStateDescription = page.locator('#psychologist-patient-empty-description');
    this.emptySearchQuery = page.locator('#psychologist-patient-empty-query');

    // Paginación.
    this.pagination = page.locator('#psychologist-patient-pagination');
    this.paginationSummary = page.locator('#psychologist-patient-pagination-summary');
    this.previousPageLink = page.locator('#psychologist-patient-pagination-previous');
    this.nextPageLink = page.locator('#psychologist-patient-pagination-next');

    // Creación.
    this.createHeading = page.locator('#psychologist-patient-create-heading');
    this.createTitle = page.locator('#psychologist-patient-create-title');
    this.createDescription = page.locator('#psychologist-patient-create-description');
    this.createBackLink = page.locator('#psychologist-patient-create-back-link');
    this.createForm = page.locator('#psychologist-patient-create-form');

    // Secciones de creación.
    this.createAccessCard = page.locator('#psychologist-patient-create-access-card');
    this.createAccessTitle = page.locator('#psychologist-patient-create-access-title');
    this.createPersonalCard = page.locator('#psychologist-patient-create-personal-card');
    this.createPersonalTitle = page.locator('#psychologist-patient-create-personal-title');
    this.createEmergencyCard = page.locator('#psychologist-patient-create-emergency-card');
    this.createEmergencyTitle = page.locator('#psychologist-patient-create-emergency-title');
    this.createClinicalCard = page.locator('#psychologist-patient-create-clinical-card');
    this.createClinicalTitle = page.locator('#psychologist-patient-create-clinical-title');

    // Campos generados por Django.
    this.firstNameInput = page.locator('#id_first_name');
    this.lastNameInput = page.locator('#id_last_name');
    this.emailInput = page.locator('#id_email');
    this.phoneInput = page.locator('#id_phone');
    this.birthDateInput = page.locator('#id_birth_date');
    this.genderSelect = page.locator('#id_gender');
    this.addressInput = page.locator('#id_address');
    this.emergencyContactNameInput = page.locator('#id_emergency_contact_name');
    this.emergencyContactPhoneInput = page.locator('#id_emergency_contact_phone');
    this.chiefComplaintInput = page.locator('#id_chief_complaint');

    // Acciones de creación.
    this.createCancelLink = page.locator('#psychologist-patient-create-cancel-link');
    this.createSubmitButton = page.locator('#psychologist-patient-create-submit-button');

    // Errores de creación.
    this.createFirstNameError = page.locator('[id^="psychologist-patient-create-first-name-error-"]');
    this.createLastNameError = page.locator('[id^="psychologist-patient-create-last-name-error-"]');
    this.createEmailError = page.locator('[id^="psychologist-patient-create-email-error-"]');
    this.createBirthDateError = page.locator('[id^="psychologist-patient-create-birth-date-error-"]');
    this.createEmergencyNameError = page.locator('[id^="psychologist-patient-create-emergency-name-error-"]');
    this.createEmergencyPhoneError = page.locator('[id^="psychologist-patient-create-emergency-phone-error-"]');

    // Paciente registrado.
    this.createdHeading = page.locator('#psychologist-patient-created-heading');
    this.createdTitle = page.locator('#psychologist-patient-created-title');
    this.createdDescription = page.locator('#psychologist-patient-created-description');
    this.createdCard = page.locator('#psychologist-patient-created-card');
    this.createdPatientName = page.locator('#psychologist-patient-created-name');
    this.createdInstructions = page.locator('#psychologist-patient-created-instructions');
    this.createdEmail = page.locator('#patient-email');
    this.createdPassword = page.locator('#patient-password');
    this.copyEmailButton = page.locator('#psychologist-patient-created-copy-email-button');
    this.copyPasswordButton = page.locator('#psychologist-patient-created-copy-password-button');
    this.createdWarning = page.locator('#psychologist-patient-created-warning');
    this.createdBackLink = page.locator('#psychologist-patient-created-back-link');
    this.createdDetailLink = page.locator('#psychologist-patient-created-detail-link');

    // Detalle.
    this.detailHeading = page.locator('#psychologist-patient-detail-heading');
    this.detailTitle = page.locator('#psychologist-patient-detail-title');
    this.detailDescription = page.locator('#psychologist-patient-detail-description');
    this.detailContainer = page.locator('#psychologist-patient-detail-container');
    this.editPatientLink = page.locator('#psychologist-patient-edit-link');
    this.clinicalRecordLink = page.locator('#psychologist-patient-clinical-record-link');
    this.detailBackLink = page.locator('#psychologist-patient-detail-back-link');

    // Perfil.
    this.profileCard = page.locator('#psychologist-patient-profile-card');
    this.profileName = page.locator('#psychologist-patient-profile-name');
    this.profileStatus = page.locator('#psychologist-patient-profile-status');
    this.patientEmailValue = page.locator('#psychologist-patient-email-value');
    this.patientPhoneValue = page.locator('#psychologist-patient-phone-value');
    this.patientBirthDateValue = page.locator('#psychologist-patient-birth-date-value');
    this.patientGenderValue = page.locator('#psychologist-patient-gender-value');
    this.patientStartDateValue = page.locator('#psychologist-patient-start-date-value');
    this.patientEndDateValue = page.locator('#psychologist-patient-end-date-value');
    this.patientAddressValue = page.locator('#psychologist-patient-address-value');
    this.patientEmergencyNameValue = page.locator('#psychologist-patient-emergency-name-value');
    this.patientEmergencyPhoneValue = page.locator('#psychologist-patient-emergency-phone-value');

    // Estado de atención.
    this.statusCard = page.locator('#psychologist-patient-status-card');
    this.statusTitle = page.locator('#psychologist-patient-status-title');
    this.statusSubtitle = page.locator('#psychologist-patient-status-subtitle');
    this.currentStatusBadge = page.locator('#psychologist-patient-current-status');
    this.statusForm = page.locator('#psychologist-patient-status-form');
    this.statusSelect = page.locator('#id_status');
    this.statusSubmitButton = page.locator('#psychologist-patient-status-submit-button');

    // Ayuda de estados.
    this.statusHelp = page.locator('#psychologist-patient-status-help');
    this.activeStatusHelp = page.locator('#psychologist-patient-status-help-active');
    this.inactiveStatusHelp = page.locator('#psychologist-patient-status-help-inactive');
    this.dischargedStatusHelp = page.locator('#psychologist-patient-status-help-discharged');

    // Citas del detalle.
    this.upcomingAppointmentsCard = page.locator('#psychologist-patient-upcoming-appointments-card');
    this.upcomingAppointmentsTitle = page.locator('#psychologist-patient-upcoming-appointments-title');
    this.upcomingAppointmentsEmpty = page.locator('#psychologist-patient-upcoming-appointments-empty');
    this.completedAppointmentsCard = page.locator('#psychologist-patient-completed-appointments-card');
    this.completedAppointmentsTitle = page.locator('#psychologist-patient-completed-appointments-title');
    this.completedAppointmentsEmpty = page.locator('#psychologist-patient-completed-appointments-empty');

    // Edición.
    this.editHeading = page.locator('#psychologist-patient-edit-heading');
    this.editTitle = page.locator('#psychologist-patient-edit-title');
    this.editDescription = page.locator('#psychologist-patient-edit-description');
    this.editBackLink = page.locator('#psychologist-patient-edit-back-link');
    this.editCard = page.locator('#psychologist-patient-edit-card');
    this.editPatientName = page.locator('#psychologist-patient-edit-patient-name');
    this.editStatus = page.locator('#psychologist-patient-edit-status');
    this.editForm = page.locator('#psychologist-patient-edit-form');
    this.editPersonalSection = page.locator('#psychologist-patient-edit-personal-section');
    this.editPersonalTitle = page.locator('#psychologist-patient-edit-personal-title');
    this.editEmergencySection = page.locator('#psychologist-patient-edit-emergency-section');
    this.editEmergencyTitle = page.locator('#psychologist-patient-edit-emergency-title');
    this.editCancelLink = page.locator('#psychologist-patient-edit-cancel-link');
    this.editSubmitButton = page.locator('#psychologist-patient-edit-submit-button');

    // Mensajes globales.
    this.systemMessages = page.locator('#system-messages');
    this.successMessage = page.locator('#system-messages [id^="system-message-text-"]');
  }

  /**
   * Abre el listado desde el enlace del menú lateral.
   */
  async openPatientList(): Promise<void> {
    await this.patientsLink.click();
  }

  /**
   * Abre el formulario para registrar un paciente.
   */
  async openCreatePatientForm(): Promise<void> {
    await this.createPatientLink.click();
  }

  /**
   * Busca un paciente por nombre o apellido.
   *
   * El formulario se envía automáticamente después de 450 ms.
   * La espera se realiza mediante la navegación provocada por el formulario,
   * evitando depender de un timeout fijo en el escenario.
   */
  async searchPatient(query: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.searchParams.get('q') === query),
      this.searchInput.fill(query),
    ]);
  }

  /**
   * Limpia el buscador y espera la navegación automática.
   */
  async clearPatientSearch(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => !url.searchParams.has('q')),
      this.searchInput.fill(''),
    ]);
  }

  /**
   * Selecciona uno de los filtros de estado.
   */
  async filterPatientsByStatus(status: PatientRelationshipStatus | 'ALL'): Promise<void> {
    const filter = {
      ALL: this.allPatientsFilter,
      ACTIVE: this.activePatientsFilter,
      INACTIVE: this.inactivePatientsFilter,
      DISCHARGED: this.dischargedPatientsFilter,
    }[status];

    await filter.click();
  }

  /**
   * Localiza una fila mediante el nombre completo y el estado.
   *
   * Los atributos data permiten evitar depender de la posición
   * del registro dentro de la tabla.
   */
  getPatientRow(fullName: string, status?: PatientRelationshipStatus): Locator {
    const escapedName = fullName.replace(/"/g, '\\"');

    if (status) {
      return this.page.locator(
        `[data-patient-name="${escapedName}"]` +
          `[data-patient-status="${status}"]`
      );
    }

    return this.page.locator(`[data-patient-name="${escapedName}"]`);
  }

  /**
   * Localiza un paciente por su identificador público.
   */
  getPatientRowById(patientId: string): Locator {
    return this.page.locator(`#psychologist-patient-row-${patientId}`);
  }

  /**
   * Abre el detalle desde una fila específica.
   */
  async openPatientDetail(row: Locator): Promise<void> {
    await row.locator('[id^="psychologist-patient-detail-link-"]').click();
  }

  /**
   * Completa todos los campos del formulario de registro.
   *
   * Los campos opcionales se completan solamente cuando
   * existe un valor dentro del objeto recibido.
   */
  async fillCreatePatientForm(data: PatientCreateData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);

    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }

    if (data.birthDate !== undefined) {
      await this.birthDateInput.fill(data.birthDate);
    }

    if (data.gender !== undefined) {
      await this.genderSelect.selectOption(data.gender);
    }

    if (data.address !== undefined) {
      await this.addressInput.fill(data.address);
    }

    if (data.emergencyContactName !== undefined) {
      await this.emergencyContactNameInput.fill(data.emergencyContactName);
    }

    if (data.emergencyContactPhone !== undefined) {
      await this.emergencyContactPhoneInput.fill(data.emergencyContactPhone);
    }

    if (data.chiefComplaint !== undefined) {
      await this.chiefComplaintInput.fill(data.chiefComplaint);
    }
  }

  /**
   * Completa el formulario y registra al paciente.
   */
  async createPatient(data: PatientCreateData): Promise<void> {
    await this.fillCreatePatientForm(data);
    await this.createSubmitButton.click();
  }

  /**
   * Abre el detalle desde la pantalla de credenciales.
   */
  async openCreatedPatientDetail(): Promise<void> {
    await this.createdDetailLink.click();
  }

  /**
   * Abre la edición desde el detalle.
   */
  async openPatientEdit(): Promise<void> {
    await this.editPatientLink.click();
  }

  /**
   * Completa los campos editables del paciente.
   */
  async fillPatientEditForm(data: PatientUpdateData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);

    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }

    if (data.birthDate !== undefined) {
      await this.birthDateInput.fill(data.birthDate);
    }

    if (data.gender !== undefined) {
      await this.genderSelect.selectOption(data.gender);
    }

    if (data.address !== undefined) {
      await this.addressInput.fill(data.address);
    }

    if (data.emergencyContactName !== undefined) {
      await this.emergencyContactNameInput.fill(data.emergencyContactName);
    }

    if (data.emergencyContactPhone !== undefined) {
      await this.emergencyContactPhoneInput.fill(data.emergencyContactPhone);
    }
  }

  /**
   * Actualiza la información general del paciente.
   */
  async updatePatient(data: PatientUpdateData): Promise<void> {
    await this.fillPatientEditForm(data);
    await this.editSubmitButton.click();
  }

  /**
   * Cambia el estado de atención del paciente.
   */
  async updatePatientStatus(status: PatientRelationshipStatus): Promise<void> {
    await this.statusSelect.selectOption(status);
    await this.statusSubmitButton.click();
  }

  /**
   * Valida los elementos permanentes del listado.
   *
   * La tabla no se valida aquí porque podría no existir cuando
   * el filtro o búsqueda no tiene resultados.
   */
  async expectPatientListVisible(): Promise<void> {
    await expect(this.listHeading).toBeVisible();
    await expect(this.listTitle).toHaveText('Mis pacientes');
    await expect(this.listDescription).toHaveText('Consulta y administra los pacientes vinculados a tu atención.');
    await expect(this.createPatientLink).toBeVisible();
    await expect(this.createPatientLink).toHaveText('Nuevo paciente');
    await expect(this.listCard).toBeVisible();
    await expect(this.listCardTitle).toHaveText('Listado de pacientes');
    await expect(this.listCardSubtitle).toHaveText('Busca por nombre y consulta su actividad clínica.');
    await expect(this.filteredPatientsCount).toBeVisible();
    await expect(this.statusFilters).toBeVisible();
    await expect(this.allPatientsFilter).toBeVisible();
    await expect(this.activePatientsFilter).toBeVisible();
    await expect(this.inactivePatientsFilter).toBeVisible();
    await expect(this.dischargedPatientsFilter).toBeVisible();
    await expect(this.searchForm).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toHaveAttribute('placeholder', 'Buscar paciente por nombre o apellido');
  }

  /**
   * Valida que el filtro indicado sea el filtro activo.
   */
  async expectActiveStatusFilter(status: PatientRelationshipStatus | 'ALL'): Promise<void> {
    const filter = {
      ALL: this.allPatientsFilter,
      ACTIVE: this.activePatientsFilter,
      INACTIVE: this.inactivePatientsFilter,
      DISCHARGED: this.dischargedPatientsFilter,
    }[status];

    await expect(filter).toHaveAttribute('aria-current', 'page');
  }

  /**
   * Valida que una fila específica se encuentre visible.
   */
  async expectPatientRowVisible(fullName: string, status?: PatientRelationshipStatus): Promise<Locator> {
    const row = this.getPatientRow(fullName, status);

    await expect(row).toBeVisible();

    return row;
  }

  /**
   * Valida que el listado no contenga una fila determinada.
   */
  async expectPatientRowNotVisible(fullName: string, status?: PatientRelationshipStatus): Promise<void> {
    await expect(this.getPatientRow(fullName, status)).toHaveCount(0);
  }

  /**
   * Valida el estado vacío de una búsqueda sin resultados.
   */
  async expectEmptySearchResult(query: string): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toHaveAttribute('data-empty-reason', 'SEARCH');
    await expect(this.emptyStateTitle).toHaveText('No encontramos pacientes');
    await expect(this.emptySearchQuery).toContainText(query);
  }

  /**
   * Valida todos los componentes principales del formulario de creación.
   */
  async expectCreatePatientFormVisible(): Promise<void> {
    await expect(this.createHeading).toBeVisible();
    await expect(this.createTitle).toHaveText('Nuevo paciente');
    await expect(this.createDescription).toHaveText('Registra la cuenta, la información personal y el expediente clínico inicial del paciente.');
    await expect(this.createBackLink).toBeVisible();
    await expect(this.createForm).toBeVisible();

    await expect(this.createAccessCard).toBeVisible();
    await expect(this.createAccessTitle).toHaveText('Datos de acceso');

    await expect(this.createPersonalCard).toBeVisible();
    await expect(this.createPersonalTitle).toHaveText('Información personal');

    await expect(this.createEmergencyCard).toBeVisible();
    await expect(this.createEmergencyTitle).toHaveText('Contacto de emergencia');

    await expect(this.createClinicalCard).toBeVisible();
    await expect(this.createClinicalTitle).toHaveText('Expediente clínico inicial');

    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.birthDateInput).toBeVisible();
    await expect(this.genderSelect).toBeVisible();
    await expect(this.addressInput).toBeVisible();
    await expect(this.emergencyContactNameInput).toBeVisible();
    await expect(this.emergencyContactPhoneInput).toBeVisible();
    await expect(this.chiefComplaintInput).toBeVisible();

    await expect(this.createCancelLink).toBeVisible();
    await expect(this.createSubmitButton).toBeVisible();
    await expect(this.createSubmitButton).toHaveText('Registrar paciente');
  }

  /**
   * Valida los valores escritos en el formulario de creación.
   */
  async expectCreatePatientFormValues(data: PatientCreateData): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(data.firstName);
    await expect(this.lastNameInput).toHaveValue(data.lastName);
    await expect(this.emailInput).toHaveValue(data.email);

    if (data.phone !== undefined) {
      await expect(this.phoneInput).toHaveValue(data.phone);
    }

    if (data.birthDate !== undefined) {
      await expect(this.birthDateInput).toHaveValue(data.birthDate);
    }

    if (data.gender !== undefined) {
      await expect(this.genderSelect).toHaveValue(data.gender);
    }

    if (data.address !== undefined) {
      await expect(this.addressInput).toHaveValue(data.address);
    }

    if (data.emergencyContactName !== undefined) {
      await expect(this.emergencyContactNameInput).toHaveValue(data.emergencyContactName);
    }

    if (data.emergencyContactPhone !== undefined) {
      await expect(this.emergencyContactPhoneInput).toHaveValue(data.emergencyContactPhone);
    }

    if (data.chiefComplaint !== undefined) {
      await expect(this.chiefComplaintInput).toHaveValue(data.chiefComplaint);
    }
  }

  /**
   * Valida la pantalla mostrada después de registrar al paciente.
   */
  async expectCreatedPatientVisible(fullName: string, email: string): Promise<void> {
    await expect(this.createdHeading).toBeVisible();
    await expect(this.createdTitle).toHaveText('Paciente registrado');
    await expect(this.createdDescription).toHaveText('La cuenta, el perfil del paciente, la relación terapéutica y el expediente clínico fueron creados correctamente.');
    await expect(this.createdCard).toBeVisible();
    await expect(this.createdPatientName).toHaveText(fullName);
    await expect(this.createdInstructions).toContainText('Comparte estas credenciales con el paciente de forma segura.');
    await expect(this.createdEmail).toHaveText(email);
    await expect(this.createdPassword).not.toHaveText('');
    await expect(this.copyEmailButton).toBeVisible();
    await expect(this.copyPasswordButton).toBeVisible();
    await expect(this.createdWarning).toContainText('esta contraseña no podrá volver a consultarse');
    await expect(this.createdBackLink).toBeVisible();
    await expect(this.createdDetailLink).toBeVisible();
  }

  /**
   * Obtiene el UUID público desde la tarjeta de confirmación.
   */
  async getCreatedPatientId(): Promise<string> {
    const patientId = await this.createdCard.getAttribute('data-patient-id');

    if (!patientId) {
      throw new Error('No se encontró el identificador público del paciente creado.');
    }

    return patientId;
  }

  /**
   * Obtiene la contraseña temporal mostrada después del registro.
   */
  async getTemporaryPassword(): Promise<string> {
    return (await this.createdPassword.textContent())?.trim() ?? '';
  }

  /**
   * Valida la estructura completa del detalle.
   */
  async expectPatientDetailVisible(): Promise<void> {
    await expect(this.detailHeading).toBeVisible();
    await expect(this.detailTitle).toHaveText('Detalle del paciente');
    await expect(this.detailDescription).toHaveText('Consulta la información general, el estado de atención y el historial de citas.');
    await expect(this.detailContainer).toBeVisible();
    await expect(this.profileCard).toBeVisible();
    await expect(this.profileName).toBeVisible();
    await expect(this.profileStatus).toBeVisible();
    await expect(this.patientEmailValue).toBeVisible();
    await expect(this.patientPhoneValue).toBeVisible();
    await expect(this.patientBirthDateValue).toBeVisible();
    await expect(this.patientGenderValue).toBeVisible();
    await expect(this.patientStartDateValue).toBeVisible();
    await expect(this.patientEndDateValue).toBeVisible();
    await expect(this.patientAddressValue).toBeVisible();
    await expect(this.patientEmergencyNameValue).toBeVisible();
    await expect(this.patientEmergencyPhoneValue).toBeVisible();
    await expect(this.statusCard).toBeVisible();
    await expect(this.statusForm).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
    await expect(this.statusSubmitButton).toBeVisible();
    await expect(this.statusHelp).toBeVisible();
    await expect(this.activeStatusHelp).toBeVisible();
    await expect(this.inactiveStatusHelp).toBeVisible();
    await expect(this.dischargedStatusHelp).toBeVisible();
    await expect(this.upcomingAppointmentsCard).toBeVisible();
    await expect(this.upcomingAppointmentsTitle).toHaveText('Próximas citas');
    await expect(this.completedAppointmentsCard).toBeVisible();
    await expect(this.completedAppointmentsTitle).toHaveText('Historial de citas');
    await expect(this.clinicalRecordLink).toBeVisible();
    await expect(this.detailBackLink).toBeVisible();
  }

  /**
   * Valida los datos generales mostrados en el detalle.
   */
  async expectPatientDetailValues(data: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  }): Promise<void> {
    await expect(this.profileName).toHaveText(data.fullName);
    await expect(this.patientEmailValue).toHaveText(data.email);
    await expect(this.patientPhoneValue).toHaveText(data.phone);
    await expect(this.patientBirthDateValue).toHaveText(data.birthDate);
    await expect(this.patientGenderValue).toHaveText(data.gender);
    await expect(this.patientAddressValue).toHaveText(data.address);
    await expect(this.patientEmergencyNameValue).toHaveText(data.emergencyContactName);
    await expect(this.patientEmergencyPhoneValue).toHaveText(data.emergencyContactPhone);
  }

  /**
   * Valida el estado actual en ambos badges y en el selector.
   */
  async expectPatientStatus(status: PatientRelationshipStatus, visibleText: string): Promise<void> {
    await expect(this.profileStatus).toHaveAttribute('data-status', status);
    await expect(this.profileStatus).toHaveText(visibleText);
    await expect(this.currentStatusBadge).toHaveAttribute('data-status', status);
    await expect(this.currentStatusBadge).toHaveText(visibleText);
    await expect(this.statusSelect).toHaveValue(status);
  }

  /**
   * Valida que la edición esté disponible únicamente para un paciente activo.
   */
  async expectEditPatientLinkVisible(): Promise<void> {
    await expect(this.editPatientLink).toBeVisible();
    await expect(this.editPatientLink).toHaveText('Editar información');
  }

  /**
   * Valida que la edición no esté disponible para un paciente
   * inactivo o dado de alta.
   */
  async expectEditPatientLinkNotVisible(): Promise<void> {
    await expect(this.editPatientLink).toHaveCount(0);
  }

  /**
   * Valida la pantalla completa de edición.
   */
  async expectPatientEditFormVisible(): Promise<void> {
    await expect(this.editHeading).toBeVisible();
    await expect(this.editTitle).toHaveText('Editar paciente');
    await expect(this.editDescription).toHaveText('Actualiza la información general y de contacto de tu paciente.');
    await expect(this.editBackLink).toBeVisible();
    await expect(this.editCard).toBeVisible();
    await expect(this.editPatientName).toBeVisible();
    await expect(this.editStatus).toBeVisible();
    await expect(this.editForm).toBeVisible();
    await expect(this.editPersonalSection).toBeVisible();
    await expect(this.editPersonalTitle).toHaveText('Información personal');
    await expect(this.editEmergencySection).toBeVisible();
    await expect(this.editEmergencyTitle).toHaveText('Contacto de emergencia');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.birthDateInput).toBeVisible();
    await expect(this.genderSelect).toBeVisible();
    await expect(this.addressInput).toBeVisible();
    await expect(this.emergencyContactNameInput).toBeVisible();
    await expect(this.emergencyContactPhoneInput).toBeVisible();
    await expect(this.emailInput).toHaveCount(0);
    await expect(this.editCancelLink).toBeVisible();
    await expect(this.editSubmitButton).toBeVisible();
    await expect(this.editSubmitButton).toHaveText('Guardar cambios');
  }

  /**
   * Valida los valores cargados en la edición.
   */
  async expectPatientEditFormValues(data: PatientUpdateData): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(data.firstName);
    await expect(this.lastNameInput).toHaveValue(data.lastName);

    if (data.phone !== undefined) {
      await expect(this.phoneInput).toHaveValue(data.phone);
    }

    if (data.birthDate !== undefined) {
      await expect(this.birthDateInput).toHaveValue(data.birthDate);
    }

    if (data.gender !== undefined) {
      await expect(this.genderSelect).toHaveValue(data.gender);
    }

    if (data.address !== undefined) {
      await expect(this.addressInput).toHaveValue(data.address);
    }

    if (data.emergencyContactName !== undefined) {
      await expect(this.emergencyContactNameInput).toHaveValue(data.emergencyContactName);
    }

    if (data.emergencyContactPhone !== undefined) {
      await expect(this.emergencyContactPhoneInput).toHaveValue(data.emergencyContactPhone);
    }
  }

  /**
   * Valida el mensaje global mostrado después de una operación correcta.
   */
  async expectSuccessMessage(message: string | RegExp): Promise<void> {
    await expect(this.systemMessages).toBeVisible();
    await expect(this.successMessage).toHaveText(message);
  }
}