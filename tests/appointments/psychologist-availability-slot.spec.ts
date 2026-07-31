import { test, expect } from '../../fixtures/pages.fixture';

import { loginAs } from '../../helpers/auth.helper';
import { buildFutureSlot, shiftSlotHours } from '../../helpers/date.helper';
import { routes } from '../../utils/routes';

/**
 * Datos compartidos por los escenarios de creación y edición.
 *
 * El primer escenario crea el cupo y el segundo modifica
 * exactamente el mismo registro.
 */
const sharedSlot = buildFutureSlot();
const updatedSlot = shiftSlotHours(sharedSlot, 1);

/**
 * Pruebas automatizadas de la gestión de cupos del psicólogo.
 *
 * Este archivo valida:
 * - El acceso al módulo de cupos.
 * - La creación de un cupo disponible.
 * - La edición del horario de un cupo existente.
 * - Los mensajes de confirmación.
 * - La actualización de los datos mostrados en el listado.
 *
 * Los escenarios se ejecutan en serie porque la edición depende
 * del cupo creado en el primer escenario.
 */
test.describe.serial('Gestión de cupos del psicólogo', () => {
  /**
   * Antes de cada escenario se inicia sesión con un psicólogo activo.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PSYCHOLOGIST');
  });

  test('Debe permitir que el psicólogo cree un cupo disponible', async ({ page, availabilitySlotPage }) => {
    // Ingresa al módulo desde el menú lateral.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la ruta y los elementos principales del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Abre el formulario de creación.
    await availabilitySlotPage.openCreateSlotForm();

    // Valida la ruta y los elementos comunes del formulario.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));
    await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Completa y guarda el cupo.
    await availabilitySlotPage.createSlot(sharedSlot.startDateTime, sharedSlot.endDateTime, 'AVAILABLE');

    // Valida la redirección y el mensaje de confirmación.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue creado correctamente\.?/i);

    // Filtra por la fecha del cupo creado.
    await availabilitySlotPage.filterByDate(sharedSlot.date);

    // Valida que el nuevo cupo aparezca en el listado.
    const createdSlotRow = await availabilitySlotPage.expectSlotRowVisible(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    await expect(createdSlotRow).toContainText('Disponible');
    await expect(createdSlotRow).toContainText('Sin paciente');
    await expect(createdSlotRow).toContainText('Sin cita asociada');
  });

  test('Debe permitir editar el horario del cupo disponible', async ({ page, availabilitySlotPage }) => {
    // Ingresa al módulo de cupos.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la ruta del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));

    // Filtra y localiza el cupo creado en el escenario anterior.
    await availabilitySlotPage.filterByDate(sharedSlot.date);

    const originalSlotRow = await availabilitySlotPage.expectSlotRowVisible(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    // Abre el formulario de edición.
    await availabilitySlotPage.openSlotEdit(originalSlotRow);

    // Valida la ruta y los elementos comunes del formulario.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que el formulario cargó los datos originales.
    await availabilitySlotPage.expectSlotFormValues(sharedSlot.startDateTime, sharedSlot.endDateTime, 'AVAILABLE');

    // Cambia el horario de 09:00-10:00 a 10:00-11:00.
    await availabilitySlotPage.updateSlot(updatedSlot.startDateTime, updatedSlot.endDateTime);

    // Valida la redirección y el mensaje de actualización.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue actualizado correctamente\.?/i);

    // Filtra nuevamente para comprobar la modificación.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Comprueba que existe el nuevo horario.
    const updatedSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'AVAILABLE');

    await expect(updatedSlotRow).toContainText('Disponible');

    // Comprueba que el horario anterior ya no existe.
    const previousSlotRow = availabilitySlotPage.getSlotRow(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    await expect(previousSlotRow).toHaveCount(0);
  });
});