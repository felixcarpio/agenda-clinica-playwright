import { type Page } from '@playwright/test';

import { test, expect } from '../../fixtures/pages.fixture';
import { AvailabilitySlotPage } from '../../pages/appointments/availability-slot.page';
import { loginAs } from '../../helpers/auth.helper';
import { buildFutureSlot, buildInvalidEndSlot, buildPastSlot, shiftSlotHours, type SlotData } from '../../helpers/date.helper';
import { routes } from '../../utils/routes';

/**
 * Datos utilizados por el flujo positivo principal.
 *
 * `sharedSlot` representa el cupo original que será creado
 * con un horario futuro válido.
 *
 * `updatedSlot` representa el mismo cupo desplazado una hora,
 * por ejemplo:
 *
 * Original:   09:00 - 10:00
 * Actualizado: 10:00 - 11:00
 *
 * Ambos objetos se generan una sola vez cuando Playwright carga
 * este archivo de pruebas.
 */
const sharedSlot = buildFutureSlot();
const updatedSlot = shiftSlotHours(sharedSlot, 1);

/**
 * Datos inválidos reutilizados en los escenarios negativos.
 *
 * `pastSlot` contiene una fecha anterior al momento de ejecución.
 *
 * `invalidEndSlot` contiene una fecha futura, pero su hora final
 * es anterior a la hora inicial.
 */
const pastSlot = buildPastSlot();
const invalidEndSlot = buildInvalidEndSlot();

/**
 * Datos válidos utilizados para preparar los escenarios negativos
 * de edición.
 *
 * Cada escenario negativo necesita un cupo válido propio antes
 * de poder intentar una modificación inválida.
 *
 * Se utilizan horarios separados para evitar que ambos escenarios
 * creen cupos que se traslapen o intenten utilizar el mismo registro.
 */
const negativeEditBaseSlot = buildFutureSlot();
const pastEditSourceSlot = shiftSlotHours(negativeEditBaseSlot, 4);
const invalidEndEditSourceSlot = shiftSlotHours(negativeEditBaseSlot, 7);

/**
 * Crea un cupo válido y abre su formulario de edición.
 *
 * Esta función funciona como una preparación reutilizable para
 * los escenarios negativos de edición.
 *
 * Se prepara el cupo desde la interfaz porque actualmente las pruebas
 * todavía no crean datos mediante API, fixtures de base de datos
 * o llamadas directas al backend.
 *
 * La función realiza el flujo completo:
 *
 * 1. Abre el listado de cupos.
 * 2. Valida la pantalla completa del listado.
 * 3. Abre el formulario de creación.
 * 4. Valida la pantalla completa de creación.
 * 5. Crea un cupo válido.
 * 6. Valida el mensaje de éxito.
 * 7. Filtra el listado por fecha.
 * 8. Localiza el cupo creado.
 * 9. Abre el formulario de edición.
 * 10. Valida la pantalla y los valores cargados.
 *
 * @param page Página de Playwright utilizada por el escenario.
 * @param availabilitySlotPage Page Object del módulo de cupos.
 * @param slot Datos válidos con los que se creará el cupo.
 */
async function createSlotAndOpenEdit(page: Page, availabilitySlotPage: AvailabilitySlotPage, slot: SlotData): Promise<void> {
  // Ingresa al módulo de cupos desde el menú lateral.
  await availabilitySlotPage.openAvailabilitySlots();

  // Valida que se haya cargado correctamente el listado de cupos.
  await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
  await availabilitySlotPage.expectSlotListVisible();

  // Abre el formulario para crear un nuevo cupo.
  await availabilitySlotPage.openCreateSlotForm();

  // Valida la URL y todos los componentes principales del formulario.
  await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));
  await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
  await availabilitySlotPage.expectInformationCardVisible();

  // Crea un cupo válido que servirá como dato previo para la edición.
  await availabilitySlotPage.createSlot(slot.startDateTime, slot.endDateTime, 'AVAILABLE');

  // Valida que la creación haya finalizado correctamente.
  await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
  await availabilitySlotPage.expectSuccessMessage(/el cupo fue creado correctamente\.?/i);

  // Reduce los resultados del listado a la fecha del cupo preparado.
  await availabilitySlotPage.filterByDate(slot.date);

  // Localiza el registro exacto mediante fecha, horario y estado.
  const slotRow = await availabilitySlotPage.expectSlotRowVisible(slot.date, slot.startTime, slot.endTime, 'AVAILABLE');

  // Abre el formulario de edición del cupo recién creado.
  await availabilitySlotPage.openSlotEdit(slotRow);

  // Valida que la pantalla completa de edición se encuentre disponible.
  await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);
  await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
  await availabilitySlotPage.expectInformationCardVisible();

  // Comprueba que el formulario cargó los datos del registro correcto.
  await availabilitySlotPage.expectSlotFormValues(slot.startDateTime, slot.endDateTime, 'AVAILABLE');
}

/**
 * Flujo positivo completo de gestión de cupos.
 *
 * Se utiliza `test.describe.serial()` porque estos escenarios
 * representan un flujo encadenado sobre el mismo registro.
 *
 * La secuencia es:
 *
 * 1. Crear un cupo disponible.
 * 2. Editar su horario.
 * 3. Cambiar su estado a bloqueado.
 * 4. Cambiar su estado a cancelado.
 *
 * Cada escenario depende del resultado del anterior. Por esa razón:
 *
 * - Deben ejecutarse en orden.
 * - No deben ejecutarse en paralelo.
 * - Si uno falla, Playwright puede omitir los siguientes para evitar
 *   continuar con un estado de datos incorrecto.
 *
 * Esta dependencia es aceptable porque el bloque representa un flujo
 * funcional completo. Los escenarios negativos, en cambio, se mantienen
 * fuera de este bloque para que puedan ejecutarse de forma independiente.
 */
test.describe.serial('Gestión de cupos del psicólogo', () => {
  /**
   * Antes de cada escenario inicia sesión con el psicólogo configurado
   * en las variables de entorno.
   *
   * Aunque los escenarios comparten el mismo cupo, cada prueba recibe
   * una página nueva y una sesión autenticada nueva.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PSYCHOLOGIST');
  });

  test('Debe permitir que el psicólogo cree un cupo disponible', { tag: ['@happypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Ingresa al módulo de cupos.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la URL y la pantalla completa del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Abre el formulario de creación.
    await availabilitySlotPage.openCreateSlotForm();

    // Valida la URL y la pantalla completa de creación.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));
    await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Completa el formulario con una fecha futura y estado disponible.
    await availabilitySlotPage.createSlot(sharedSlot.startDateTime, sharedSlot.endDateTime, 'AVAILABLE');

    // Valida la redirección y el mensaje de éxito.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue creado correctamente\.?/i);

    // Filtra el listado para localizar con precisión el cupo creado.
    await availabilitySlotPage.filterByDate(sharedSlot.date);

    // Busca la fila mediante los atributos data del HTML.
    const createdSlotRow = await availabilitySlotPage.expectSlotRowVisible(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    // Valida la información visible del nuevo cupo.
    await expect(createdSlotRow).toContainText('Disponible');
    await expect(createdSlotRow).toContainText('Sin paciente');
    await expect(createdSlotRow).toContainText('Sin cita asociada');
  });

  test('Debe permitir editar el horario del cupo disponible', { tag: ['@happypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Ingresa nuevamente al módulo de cupos.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la URL y la pantalla completa del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Filtra por la fecha del cupo creado en el escenario anterior.
    await availabilitySlotPage.filterByDate(sharedSlot.date);

    // Localiza el cupo con su horario original.
    const originalSlotRow = await availabilitySlotPage.expectSlotRowVisible(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    // Abre la edición del registro encontrado.
    await availabilitySlotPage.openSlotEdit(originalSlotRow);

    // Valida la URL, el formulario y la tarjeta informativa.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que se cargaron los valores actuales del cupo.
    await availabilitySlotPage.expectSlotFormValues(sharedSlot.startDateTime, sharedSlot.endDateTime, 'AVAILABLE');

    // Modifica el inicio y fin desplazando el horario una hora.
    await availabilitySlotPage.updateSlot(updatedSlot.startDateTime, updatedSlot.endDateTime);

    // Valida la redirección y el mensaje de actualización.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue actualizado correctamente\.?/i);

    // Filtra el listado para comprobar el nuevo horario.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Valida que ahora exista la fila con los datos actualizados.
    const updatedSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'AVAILABLE');

    // Comprueba que el estado continúa siendo disponible.
    await expect(updatedSlotRow).toContainText('Disponible');

    // Busca la combinación anterior de fecha y horario.
    const previousSlotRow = availabilitySlotPage.getSlotRow(sharedSlot.date, sharedSlot.startTime, sharedSlot.endTime, 'AVAILABLE');

    // Confirma que el registro con el horario anterior ya no existe.
    await expect(previousSlotRow).toHaveCount(0);
  });

  test('Debe permitir cambiar un cupo disponible al estado bloqueado', { tag: ['@happypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Ingresa al listado de cupos.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la URL y todos los elementos principales del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Filtra por la fecha del cupo actualizado.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Localiza el cupo que todavía se encuentra disponible.
    const availableSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'AVAILABLE');

    // Abre el formulario de edición.
    await availabilitySlotPage.openSlotEdit(availableSlotRow);

    // Valida la pantalla completa de edición.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba los datos actuales antes de modificar el estado.
    await availabilitySlotPage.expectSlotFormValues(updatedSlot.startDateTime, updatedSlot.endDateTime, 'AVAILABLE');

    // Cambia únicamente el estado a bloqueado.
    await availabilitySlotPage.updateSlotStatus('BLOCKED');

    // Valida la redirección y el mensaje de actualización.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue actualizado correctamente\.?/i);

    // Filtra nuevamente por la fecha del registro.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Comprueba que existe una fila con estado bloqueado.
    const blockedSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'BLOCKED');

    // Valida el texto visible del badge de estado.
    await expect(blockedSlotRow).toContainText('Bloqueado');

    // Busca la versión anterior con estado disponible.
    const previousAvailableRow = availabilitySlotPage.getSlotRow(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'AVAILABLE');

    // Confirma que el mismo cupo ya no aparece como disponible.
    await expect(previousAvailableRow).toHaveCount(0);
  });

  test('Debe permitir cambiar un cupo bloqueado al estado cancelado', { tag: ['@happypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Ingresa al listado de cupos.
    await availabilitySlotPage.openAvailabilitySlots();

    // Valida la URL y la pantalla completa.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Filtra por la fecha del cupo bloqueado.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Localiza el registro cuyo estado actual es bloqueado.
    const blockedSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'BLOCKED');

    // Abre el formulario de edición.
    await availabilitySlotPage.openSlotEdit(blockedSlotRow);

    // Valida la pantalla completa del formulario.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que el estado actual cargado sea bloqueado.
    await availabilitySlotPage.expectSlotFormValues(updatedSlot.startDateTime, updatedSlot.endDateTime, 'BLOCKED');

    // Cambia únicamente el estado a cancelado.
    await availabilitySlotPage.updateSlotStatus('CANCELLED');

    // Valida la redirección y el mensaje de actualización.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSuccessMessage(/el cupo fue actualizado correctamente\.?/i);

    // Filtra para localizar el registro actualizado.
    await availabilitySlotPage.filterByDate(updatedSlot.date);

    // Comprueba que el cupo ahora tiene estado cancelado.
    const cancelledSlotRow = await availabilitySlotPage.expectSlotRowVisible(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'CANCELLED');

    // Valida el texto visible del nuevo estado.
    await expect(cancelledSlotRow).toContainText('Cancelado');

    // Busca la versión anterior con estado bloqueado.
    const previousBlockedRow = availabilitySlotPage.getSlotRow(updatedSlot.date, updatedSlot.startTime, updatedSlot.endTime, 'BLOCKED');

    // Confirma que el mismo cupo ya no aparece como bloqueado.
    await expect(previousBlockedRow).toHaveCount(0);
  });
});

/**
 * Validaciones negativas de creación de cupos.
 *
 * Estos escenarios no necesitan registros previamente creados.
 * Cada uno abre directamente el formulario e intenta enviar datos
 * inválidos.
 *
 * Se utiliza un `describe` normal porque:
 *
 * - Los escenarios son independientes.
 * - No necesitan ejecutarse en orden.
 * - Pueden ejecutarse individualmente mediante tags.
 * - Un fallo no debe provocar que el siguiente escenario se omita.
 */
test.describe('Validaciones de creación de cupos', () => {
  /**
   * Antes de cada escenario:
   *
   * 1. Inicia sesión como psicólogo.
   * 2. Abre el listado de cupos.
   * 3. Valida la pantalla completa del listado.
   * 4. Abre el formulario de creación.
   * 5. Valida la pantalla completa del formulario.
   */
  test.beforeEach(async ({ page, availabilitySlotPage }) => {
    await loginAs(page, 'PSYCHOLOGIST');
    await availabilitySlotPage.openAvailabilitySlots();

    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    await availabilitySlotPage.openCreateSlotForm();

    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));
    await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
    await availabilitySlotPage.expectInformationCardVisible();
  });

  test('Debe impedir crear un cupo en una fecha y hora pasada', { tag: ['@unhappypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Intenta crear un cupo con inicio y fin en el pasado.
    await availabilitySlotPage.createSlot(pastSlot.startDateTime, pastSlot.endDateTime, 'AVAILABLE');

    // Comprueba que el backend no redirigió al listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));

    // Valida nuevamente la pantalla completa después del envío inválido.
    await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que los valores ingresados permanezcan en el formulario.
    await availabilitySlotPage.expectSlotFormValues(pastSlot.startDateTime, pastSlot.endDateTime, 'AVAILABLE');

    // Valida el mensaje específico asociado al campo de fecha inicial.
    await availabilitySlotPage.expectPastStartTimeError('No se puede guardar un cupo en una fecha u hora pasada.');

    // Confirma que no se haya mostrado una alerta de operación exitosa.
    await availabilitySlotPage.expectSuccessMessageNotVisible();
  });

  test('Debe impedir crear un cupo cuya fecha final sea anterior a la inicial', { tag: ['@unhappypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Intenta crear un cupo futuro cuyo fin es anterior al inicio.
    await availabilitySlotPage.createSlot(invalidEndSlot.startDateTime, invalidEndSlot.endDateTime, 'AVAILABLE');

    // Comprueba que el usuario permanezca en el formulario.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.createAvailabilitySlot}?$`));

    // Valida nuevamente la pantalla completa después del error.
    await availabilitySlotPage.expectSlotFormVisible('Crear cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que los valores inválidos permanezcan visibles.
    await availabilitySlotPage.expectSlotFormValues(invalidEndSlot.startDateTime, invalidEndSlot.endDateTime, 'AVAILABLE');

    // Valida el mensaje asociado al campo de fecha final.
    await availabilitySlotPage.expectInvalidEndTimeError();

    // Confirma que el sistema no mostró una alerta de éxito.
    await availabilitySlotPage.expectSuccessMessageNotVisible();
  });
});

/**
 * Validaciones negativas de edición de cupos.
 *
 * Cada escenario crea su propio cupo válido antes de intentar
 * una modificación inválida.
 *
 * Esta estrategia evita depender del flujo positivo serial y permite:
 *
 * - Ejecutar únicamente `@unhappypath`.
 * - Ejecutar cada escenario de manera individual.
 * - Evitar pruebas omitidas por fallos de escenarios anteriores.
 * - Garantizar que cada prueba controla sus propios datos.
 *
 * Actualmente la preparación se realiza mediante la interfaz usando
 * `createSlotAndOpenEdit()`. En el futuro podría reemplazarse por una
 * preparación mediante API para reducir el tiempo de ejecución.
 */
test.describe('Validaciones de edición de cupos', () => {
  /**
   * Antes de cada escenario inicia sesión como psicólogo.
   *
   * La creación del cupo válido se realiza dentro de cada test porque
   * cada escenario utiliza un horario distinto.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PSYCHOLOGIST');
  });

  test('Debe impedir editar un cupo con una fecha y hora pasada', { tag: ['@unhappypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Crea un cupo válido independiente y abre su formulario de edición.
    await createSlotAndOpenEdit(page, availabilitySlotPage, pastEditSourceSlot);

    // Intenta reemplazar su horario válido por uno ubicado en el pasado.
    await availabilitySlotPage.updateSlot(pastSlot.startDateTime, pastSlot.endDateTime);

    // Comprueba que el sistema permanezca en la misma pantalla de edición.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);

    // Valida nuevamente todos los componentes principales del formulario.
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que los valores inválidos permanezcan cargados.
    await availabilitySlotPage.expectSlotFormValues(pastSlot.startDateTime, pastSlot.endDateTime, 'AVAILABLE');

    // Valida el mensaje de error correspondiente.
    await availabilitySlotPage.expectPastStartTimeError('No se puede guardar un cupo en una fecha u hora pasada.');

    // Confirma que no se haya mostrado una alerta de éxito.
    await availabilitySlotPage.expectSuccessMessageNotVisible();

    // Cancela la edición para regresar al listado sin guardar cambios.
    await availabilitySlotPage.cancelLink.click();

    // Valida la pantalla completa del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Filtra por la fecha original del cupo preparado.
    await availabilitySlotPage.filterByDate(pastEditSourceSlot.date);

    // Comprueba que el registro original conserva su horario válido.
    await availabilitySlotPage.expectSlotRowVisible(pastEditSourceSlot.date, pastEditSourceSlot.startTime, pastEditSourceSlot.endTime, 'AVAILABLE');
  });

  test('Debe impedir editar un cupo con una fecha final anterior a la inicial', { tag: ['@unhappypath', '@regressiontest', '@slots'] }, async ({ page, availabilitySlotPage }) => {
    // Crea otro cupo válido independiente y abre su edición.
    await createSlotAndOpenEdit(page, availabilitySlotPage, invalidEndEditSourceSlot);

    // Intenta reemplazar el horario por uno cuyo fin es anterior al inicio.
    await availabilitySlotPage.updateSlot(invalidEndSlot.startDateTime, invalidEndSlot.endDateTime);

    // Comprueba que el backend mantenga al usuario en la pantalla de edición.
    await expect(page).toHaveURL(/\/mis-cupos\/[^/]+\/editar\/?$/);

    // Valida nuevamente la pantalla completa después del envío inválido.
    await availabilitySlotPage.expectSlotFormVisible('Editar cupo');
    await availabilitySlotPage.expectInformationCardVisible();

    // Comprueba que los datos inválidos permanezcan visibles.
    await availabilitySlotPage.expectSlotFormValues(invalidEndSlot.startDateTime, invalidEndSlot.endDateTime, 'AVAILABLE');

    // Valida el mensaje de error asociado a la fecha final.
    await availabilitySlotPage.expectInvalidEndTimeError();

    // Confirma que no se haya mostrado una alerta de éxito.
    await availabilitySlotPage.expectSuccessMessageNotVisible();

    // Cancela el formulario para regresar al listado sin guardar.
    await availabilitySlotPage.cancelLink.click();

    // Valida nuevamente la pantalla completa del listado.
    await expect(page).toHaveURL(new RegExp(`${routes.psychologist.availabilitySlots}?$`));
    await availabilitySlotPage.expectSlotListVisible();

    // Filtra por la fecha original del cupo preparado.
    await availabilitySlotPage.filterByDate(invalidEndEditSourceSlot.date);

    // Comprueba que el cupo conserva el horario válido original.
    await availabilitySlotPage.expectSlotRowVisible(invalidEndEditSourceSlot.date, invalidEndEditSourceSlot.startTime, invalidEndEditSourceSlot.endTime, 'AVAILABLE');
  });
});