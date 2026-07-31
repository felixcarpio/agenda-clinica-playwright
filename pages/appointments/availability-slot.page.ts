import { expect, type Locator, type Page } from '@playwright/test';

import { DashboardPage } from '../dashboards/dashboard.page';

/**
 * Page Object del flujo de gestión de cupos del psicólogo.
 *
 * Centraliza:
 * - Los elementos del listado de cupos.
 * - Los filtros disponibles.
 * - El formulario de creación y edición.
 * - Las acciones de creación, edición y búsqueda.
 * - Las validaciones reutilizables del módulo.
 */
export class AvailabilitySlotPage extends DashboardPage {
  // Navegación.
  readonly slotsLink: Locator;

  // Listado de cupos.
  readonly listTitle: Locator;
  readonly listDescription: Locator;
  readonly createSlotLink: Locator;
  readonly slotsTable: Locator;
  readonly slotsTableBody: Locator;
  readonly emptyState: Locator;
  readonly createFirstSlotLink: Locator;

  // Tarjeta informativa del formulario.
  readonly infoSlotCard: Locator;
  readonly infoSlotCardTitle: Locator;
  readonly infoSlotCardSubtitle: Locator;
  readonly infoSlotCardNoticeBullet: Locator;
  readonly infoSlotCardNoticeText: Locator;
  readonly infoSlotCardStateBullet: Locator;
  readonly infoSlotCardStateText: Locator;
  readonly infoSlotCardReservedBullet: Locator;
  readonly infoSlotCardReservedText: Locator;

  // Filtros del listado.
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly statusFilterSelect: Locator;
  readonly orderSelect: Locator;
  readonly filterSubmitButton: Locator;
  readonly clearFilterLink: Locator;

  // Formulario de creación y edición.
  readonly formTitle: Locator;
  readonly formDescription: Locator;
  readonly slotForm: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly statusSelect: Locator;
  readonly submitButton: Locator;
  readonly cancelLink: Locator;

  // Mensajes del sistema.
  readonly systemMessages: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Navegación.
    this.slotsLink = page.locator('#sidebar-psychologist-slots-link');

    // Listado de cupos.
    this.listTitle = page.locator('#availability-slot-list-title');
    this.listDescription = page.locator('#availability-slot-list-description');
    this.createSlotLink = page.locator('#availability-slot-create-link');
    this.slotsTable = page.locator('#availability-slot-table');
    this.slotsTableBody = page.locator('#availability-slot-table-body');
    this.emptyState = page.locator('#availability-slot-empty-state');
    this.createFirstSlotLink = page.locator('#availability-slot-create-first-link');

    // Tarjeta informativa.
    this.infoSlotCard = page.locator('#availability-slot-summary-card');
    this.infoSlotCardTitle = page.locator('#availability-slot-summary-title');
    this.infoSlotCardSubtitle = page.locator('#availability-slot-summary-subtitle');
    this.infoSlotCardNoticeBullet = page.locator('#availability-slot-schedule-notice-title');
    this.infoSlotCardNoticeText = page.locator('#availability-slot-schedule-notice-text');
    this.infoSlotCardStateBullet = page.locator('#availability-slot-status-notice-title');
    this.infoSlotCardStateText = page.locator('#availability-slot-status-notice-text');
    this.infoSlotCardReservedBullet = page.locator('#availability-slot-booked-notice-title');
    this.infoSlotCardReservedText = page.locator('#availability-slot-booked-notice-text');

    // Filtros.
    this.dateFromInput = page.locator('#id_date_from');
    this.dateToInput = page.locator('#id_date_to');
    this.statusFilterSelect = page.locator('#availability-slot-status-filter-group #id_status');
    this.orderSelect = page.locator('#id_order');
    this.filterSubmitButton = page.locator('#availability-slot-filter-submit');
    this.clearFilterLink = page.locator('#availability-slot-filter-clear');

    // Formulario.
    this.formTitle = page.locator('#availability-slot-form-title');
    this.formDescription = page.locator('#availability-slot-form-description');
    this.slotForm = page.locator('#availability-slot-form');
    this.startTimeInput = page.locator('#id_start_time');
    this.endTimeInput = page.locator('#id_end_time');
    this.statusSelect = page.locator('#availability-slot-status-group #id_status');
    this.submitButton = page.locator('#availability-slot-submit-button');
    this.cancelLink = page.locator('#availability-slot-cancel-link');

    // Mensajes del sistema.
    this.systemMessages = page.locator('#system-messages');
    this.successMessage = page.locator('#system-messages [id^="system-message-text-"]');
  }

  /**
   * Ingresa a la sección de cupos desde el menú lateral.
   */
  async openAvailabilitySlots(): Promise<void> {
    await this.slotsLink.click();
  }

  /**
   * Abre el formulario para crear un cupo.
   *
   * También contempla el botón del estado vacío.
   */
  async openCreateSlotForm(): Promise<void> {
    if (await this.createSlotLink.isVisible()) {
      await this.createSlotLink.click();
      return;
    }

    await this.createFirstSlotLink.click();
  }

  /**
   * Completa y envía el formulario de creación de cupo.
   *
   * @param startTime Fecha y hora inicial en formato datetime-local.
   * @param endTime Fecha y hora final en formato datetime-local.
   * @param status Estado que tendrá el cupo.
   */
  async createSlot(startTime: string, endTime: string, status: string = 'AVAILABLE'): Promise<void> {
    await this.startTimeInput.fill(startTime);
    await this.endTimeInput.fill(endTime);
    await this.statusSelect.selectOption(status);
    await this.submitButton.click();
  }

  /**
   * Filtra el listado por una fecha específica.
   *
   * @param date Fecha en formato YYYY-MM-DD.
   */
  async filterByDate(date: string): Promise<void> {
    await this.dateFromInput.fill(date);
    await this.dateToInput.fill(date);
    await this.filterSubmitButton.click();
  }

  /**
   * Localiza una fila por sus atributos de fecha, horario y estado.
   */
  getSlotRow(date: string, startTime: string, endTime: string, status: string = 'AVAILABLE'): Locator {
    return this.page.locator(
      `[data-slot-date="${date}"]` +
        `[data-slot-start-time="${startTime}"]` +
        `[data-slot-end-time="${endTime}"]` +
        `[data-slot-status="${status}"]`
    );
  }

  /**
   * Abre el formulario de edición del cupo indicado.
   *
   * @param row Fila correspondiente al cupo.
   */
  async openSlotEdit(row: Locator): Promise<void> {
    await row.locator('[id^="availability-slot-edit-"]').click();
  }

  /**
   * Modifica el horario de un cupo y guarda los cambios.
   *
   * @param startTime Nueva fecha y hora inicial.
   * @param endTime Nueva fecha y hora final.
   */
  async updateSlot(startTime: string, endTime: string): Promise<void> {
    await this.startTimeInput.fill(startTime);
    await this.endTimeInput.fill(endTime);
    await this.submitButton.click();
  }

  /**
   * Valida los elementos principales del listado de cupos.
   */
  async expectSlotListVisible(): Promise<void> {
    await expect(this.listTitle).toHaveText('Mis cupos');
    await expect(this.listDescription).toHaveText('Consulta y administra tus horarios disponibles, reservados, bloqueados y cancelados.');
    await expect(this.createSlotLink).toBeVisible();
    await expect(this.createSlotLink).toHaveText('Crear cupo');
  }

  /**
   * Valida los elementos comunes del formulario de creación y edición.
   *
   * @param title Título esperado en el formulario.
   */
  async expectSlotFormVisible(title: string): Promise<void> {
    await expect(this.formTitle).toHaveText(title);
    await expect(this.formDescription).toHaveText('Define un horario disponible para la agenda.');
    await expect(this.slotForm).toBeVisible();
    await expect(this.startTimeInput).toBeVisible();
    await expect(this.endTimeInput).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.cancelLink).toBeVisible();
  }

  /**
   * Valida la tarjeta informativa mostrada junto al formulario.
   */
  async expectInformationCardVisible(): Promise<void> {
    await expect(this.infoSlotCard).toBeVisible();
    await expect(this.infoSlotCardTitle).toHaveText('Información del cupo');
    await expect(this.infoSlotCardSubtitle).toHaveText('Recomendaciones para configurar el horario.');
    await expect(this.infoSlotCardNoticeBullet).toHaveText('Horario de atención');
    await expect(this.infoSlotCardNoticeText).toHaveText('La fecha de finalización debe ser posterior a la fecha de inicio.');
    await expect(this.infoSlotCardStateBullet).toHaveText('Estado disponible');
    await expect(this.infoSlotCardStateText).toHaveText('Los pacientes solo podrán reservar cupos que estén marcados como disponibles.');
    await expect(this.infoSlotCardReservedBullet).toHaveText('Cupos reservados');
    await expect(this.infoSlotCardReservedText).toHaveText('Un cupo reservado no puede modificarse manualmente desde esta pantalla.');
  }

  /**
   * Valida los valores cargados en el formulario.
   *
   * @param startTime Fecha y hora inicial esperada.
   * @param endTime Fecha y hora final esperada.
   * @param status Estado esperado.
   */
  async expectSlotFormValues(startTime: string, endTime: string, status: string): Promise<void> {
    await expect(this.startTimeInput).toHaveValue(startTime);
    await expect(this.endTimeInput).toHaveValue(endTime);
    await expect(this.statusSelect).toHaveValue(status);
  }

  /**
   * Valida un mensaje de operación exitosa.
   *
   * @param message Texto o expresión regular esperada.
   */
  async expectSuccessMessage(message: string | RegExp): Promise<void> {
    await expect(this.systemMessages).toBeVisible();
    await expect(this.successMessage).toHaveText(message);
  }

  /**
   * Valida que exista una fila con los datos indicados.
   *
   * @returns La fila localizada para realizar validaciones adicionales.
   */
  async expectSlotRowVisible(date: string, startTime: string, endTime: string, status: string = 'AVAILABLE'): Promise<Locator> {
    const row = this.getSlotRow(date, startTime, endTime, status);

    await expect(row).toBeVisible();

    return row;
  }
}