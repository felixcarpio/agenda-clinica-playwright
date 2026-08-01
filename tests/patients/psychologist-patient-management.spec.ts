import { test, expect } from '../../fixtures/pages.fixture';
import { loginAs } from '../../helpers/auth.helper';
import { buildPatientTestData } from '../../helpers/patient.helper';
import { routes } from '../../utils/routes';

/**
 * Datos compartidos por el flujo principal.
 *
 * Se construyen una sola vez al cargar este archivo para que todos
 * los escenarios del bloque serial trabajen con el mismo paciente.
 */
const patientData = buildPatientTestData();

/**
 * Flujo principal de administración de pacientes del psicólogo.
 *
 * Se utiliza `describe.serial()` porque los escenarios modifican
 * progresivamente el mismo registro:
 *
 * 1. Se valida el listado.
 * 2. Se registra un paciente.
 * 3. Se busca y consulta.
 * 4. Se filtra como paciente activo.
 * 5. Se edita su información.
 * 6. Se cambia a estado inactivo.
 * 7. Se cambia a estado dado de alta.
 *
 * Si uno de los escenarios falla, Playwright puede omitir los
 * siguientes porque el paciente posiblemente no quedó en el estado
 * necesario para continuar el flujo.
 */
test.describe.serial('Gestión de pacientes del psicólogo', () => {
  /**
   * Cada escenario recibe un contexto nuevo del navegador.
   *
   * Por esta razón se inicia sesión antes de cada prueba, aunque
   * el paciente creado permanece almacenado en la base de datos.
   */
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'PSYCHOLOGIST');
  });

  test(
    'Debe mostrar el listado principal de pacientes',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      // Ingresa al módulo desde el menú lateral del psicólogo.
      await patientManagementPage.openPatientList();

      // Valida la ruta fija del listado.
      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      // Valida todos los componentes permanentes de la pantalla.
      await patientManagementPage.expectPatientListVisible();

      // Al abrir el listado sin parámetros, el filtro activo debe ser Todos.
      await patientManagementPage.expectActiveStatusFilter('ALL');
    },
  );

  test(
    'Debe permitir registrar un paciente y mostrar sus credenciales temporales',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      // Abre el listado de pacientes.
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      // Abre el formulario de registro.
      await patientManagementPage.openCreatePatientForm();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.create}?$`),
      );

      // Valida las cuatro secciones y todos los campos del formulario.
      await patientManagementPage.expectCreatePatientFormVisible();

      // Completa y envía el formulario con información válida.
      await patientManagementPage.createPatient(
        patientData.createData,
      );

      /**
       * Después de registrar correctamente al paciente, el sistema
       * redirige a una pantalla especial que muestra la contraseña
       * temporal una sola vez.
       */
      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.created}?$`),
      );

      // Valida nombre, correo, contraseña temporal y acciones.
      await patientManagementPage.expectCreatedPatientVisible(
        patientData.originalFullName,
        patientData.createData.email,
      );

      // Recupera el identificador público mostrado como data attribute.
      const patientId =
        await patientManagementPage.getCreatedPatientId();

      // Comprueba que se haya recibido un UUID no vacío.
      expect(patientId).not.toBe('');

      // Recupera la contraseña temporal presentada por el sistema.
      const temporaryPassword =
        await patientManagementPage.getTemporaryPassword();

      // La contraseña generada por Django debe tener 12 caracteres.
      expect(temporaryPassword).toHaveLength(12);

      /**
       * No se valida aquí el mensaje global de éxito porque esta
       * pantalla es la confirmación principal de la operación y las
       * credenciales se consumen al cargarla.
       */
    },
  );

  test(
    'Debe permitir buscar al paciente por su nombre',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      /**
       * La búsqueda utiliza solamente el apellido dinámico.
       *
       * Esto comprueba la búsqueda parcial implementada por el backend
       * y reduce la posibilidad de encontrar pacientes no relacionados.
       */
      await patientManagementPage.searchPatient(
        patientData.createData.lastName,
      );

      // Confirma que la URL contiene el parámetro de búsqueda.
      await expect(page).toHaveURL(
        (url) =>
          url.pathname === routes.patients.list &&
          url.searchParams.get('q') ===
            patientData.createData.lastName,
      );

      // Valida que la pantalla continúe completa después del filtrado.
      await patientManagementPage.expectPatientListVisible();

      // Comprueba que aparezca el paciente creado y que esté activo.
      await patientManagementPage.expectPatientRowVisible(
        patientData.originalFullName,
        'ACTIVE',
      );
    },
  );

  test(
    'Debe permitir filtrar los pacientes activos',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      // Selecciona el filtro de relaciones terapéuticas activas.
      await patientManagementPage.filterPatientsByStatus(
        'ACTIVE',
      );

      // Comprueba el parámetro utilizado por el backend.
      await expect(page).toHaveURL(
        (url) =>
          url.pathname === routes.patients.list &&
          url.searchParams.get('status') === 'ACTIVE',
      );

      // Valida nuevamente los elementos permanentes del listado.
      await patientManagementPage.expectPatientListVisible();

      // Confirma visualmente que Activos sea el filtro seleccionado.
      await patientManagementPage.expectActiveStatusFilter(
        'ACTIVE',
      );

      // El paciente recién creado debe aparecer en este filtro.
      await patientManagementPage.expectPatientRowVisible(
        patientData.originalFullName,
        'ACTIVE',
      );
    },
  );

  test(
    'Debe permitir abrir el detalle del paciente',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      // Busca el paciente para aislar su fila.
      await patientManagementPage.searchPatient(
        patientData.createData.lastName,
      );

      // Localiza la fila exacta mediante nombre completo y estado.
      const patientRow =
        await patientManagementPage.expectPatientRowVisible(
          patientData.originalFullName,
          'ACTIVE',
        );

      // Abre el detalle desde la acción de la fila encontrada.
      await patientManagementPage.openPatientDetail(
        patientRow,
      );

      // El identificador de paciente es dinámico, por eso usamos regex.
      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      // Valida la estructura completa del detalle.
      await patientManagementPage.expectPatientDetailVisible();

      // Comprueba la información registrada originalmente.
      await patientManagementPage.expectPatientDetailValues({
        fullName: patientData.originalFullName,
        email: patientData.createData.email,
        phone: patientData.createData.phone ?? '',
        birthDate: patientData.visibleBirthDate,
        gender: patientData.visibleGender,
        address: patientData.createData.address ?? '',
        emergencyContactName:
          patientData.createData
            .emergencyContactName ?? '',
        emergencyContactPhone:
          patientData.createData
            .emergencyContactPhone ?? '',
      });

      // La nueva relación terapéutica debe iniciar como activa.
      await patientManagementPage.expectPatientStatus(
        'ACTIVE',
        'Activo',
      );

      // Solo los pacientes activos pueden ser editados por el psicólogo.
      await patientManagementPage.expectEditPatientLinkVisible();
    },
  );

  test(
    'Debe permitir editar la información del paciente activo',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      // Busca al paciente mediante su apellido original.
      await patientManagementPage.searchPatient(
        patientData.createData.lastName,
      );

      const patientRow =
        await patientManagementPage.expectPatientRowVisible(
          patientData.originalFullName,
          'ACTIVE',
        );

      await patientManagementPage.openPatientDetail(
        patientRow,
      );

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      await patientManagementPage.expectPatientDetailVisible();
      await patientManagementPage.expectEditPatientLinkVisible();

      // Abre el formulario de edición.
      await patientManagementPage.openPatientEdit();

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/editar\/?$/,
      );

      // Valida todas las secciones y confirma que no exista correo.
      await patientManagementPage.expectPatientEditFormVisible();

      // Comprueba que el formulario cargó los valores originales.
      await patientManagementPage.expectPatientEditFormValues({
        firstName: patientData.createData.firstName,
        lastName: patientData.createData.lastName,
        phone: patientData.createData.phone,
        birthDate: patientData.createData.birthDate,
        gender: patientData.createData.gender,
        address: patientData.createData.address,
        emergencyContactName:
          patientData.createData
            .emergencyContactName,
        emergencyContactPhone:
          patientData.createData
            .emergencyContactPhone,
      });

      // Reemplaza la información editable.
      await patientManagementPage.updatePatient(
        patientData.updateData,
      );

      // La vista redirige nuevamente al detalle.
      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      // Valida el mensaje configurado en la vista de Django.
      await patientManagementPage.expectSuccessMessage(
        'La información del paciente fue actualizada correctamente.',
      );

      // Valida nuevamente toda la pantalla después de guardar.
      await patientManagementPage.expectPatientDetailVisible();

      // Comprueba que los nuevos datos sean visibles.
      await patientManagementPage.expectPatientDetailValues({
        fullName: patientData.updatedFullName,
        email: patientData.createData.email,
        phone: patientData.updateData.phone ?? '',
        birthDate:
          patientData.updatedVisibleBirthDate,
        gender:
          patientData.updatedVisibleGender,
        address:
          patientData.updateData.address ?? '',
        emergencyContactName:
          patientData.updateData
            .emergencyContactName ?? '',
        emergencyContactPhone:
          patientData.updateData
            .emergencyContactPhone ?? '',
      });

      // La edición no debe modificar el estado terapéutico.
      await patientManagementPage.expectPatientStatus(
        'ACTIVE',
        'Activo',
      );
    },
  );

  test(
    'Debe permitir cambiar el estado del paciente a inactivo',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      // Busca mediante el apellido actualizado.
      await patientManagementPage.searchPatient(
        patientData.updateData.lastName,
      );

      const patientRow =
        await patientManagementPage.expectPatientRowVisible(
          patientData.updatedFullName,
          'ACTIVE',
        );

      await patientManagementPage.openPatientDetail(
        patientRow,
      );

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      await patientManagementPage.expectPatientDetailVisible();

      // Confirma el estado previo antes de ejecutar el cambio.
      await patientManagementPage.expectPatientStatus(
        'ACTIVE',
        'Activo',
      );

      // Actualiza la relación terapéutica a estado inactivo.
      await patientManagementPage.updatePatientStatus(
        'INACTIVE',
      );

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      // Valida el mensaje exacto generado por la vista.
      await patientManagementPage.expectSuccessMessage(
        'El estado del paciente fue actualizado a Inactivo.',
      );

      // Comprueba el nuevo estado en ambos badges y el selector.
      await patientManagementPage.expectPatientStatus(
        'INACTIVE',
        'Inactivo',
      );

      /**
       * La vista de edición únicamente admite relaciones activas.
       * Por eso el botón debe desaparecer después de este cambio.
       */
      await patientManagementPage.expectEditPatientLinkNotVisible();
    },
  );

  test(
    'Debe mostrar al paciente dentro del filtro de inactivos',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      await patientManagementPage.filterPatientsByStatus(
        'INACTIVE',
      );

      await expect(page).toHaveURL(
        (url) =>
          url.pathname === routes.patients.list &&
          url.searchParams.get('status') === 'INACTIVE',
      );

      await patientManagementPage.expectPatientListVisible();
      await patientManagementPage.expectActiveStatusFilter(
        'INACTIVE',
      );

      await patientManagementPage.expectPatientRowVisible(
        patientData.updatedFullName,
        'INACTIVE',
      );
    },
  );

  test(
    'Debe permitir cambiar el estado del paciente a dado de alta',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      await patientManagementPage.searchPatient(
        patientData.updateData.lastName,
      );

      const patientRow =
        await patientManagementPage.expectPatientRowVisible(
          patientData.updatedFullName,
          'INACTIVE',
        );

      await patientManagementPage.openPatientDetail(
        patientRow,
      );

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      await patientManagementPage.expectPatientDetailVisible();

      // Confirma que el estado anterior sea inactivo.
      await patientManagementPage.expectPatientStatus(
        'INACTIVE',
        'Inactivo',
      );

      // Cambia la relación al estado de proceso finalizado.
      await patientManagementPage.updatePatientStatus(
        'DISCHARGED',
      );

      await expect(page).toHaveURL(
        /\/mis-pacientes\/[^/]+\/detalle\/?$/,
      );

      await patientManagementPage.expectSuccessMessage(
        'El estado del paciente fue actualizado a Dado de alta.',
      );

      await patientManagementPage.expectPatientStatus(
        'DISCHARGED',
        'Dado de alta',
      );

      // Un paciente dado de alta tampoco puede editarse.
      await patientManagementPage.expectEditPatientLinkNotVisible();
    },
  );

  test(
    'Debe mostrar al paciente dentro del filtro de dados de alta',
    {
      tag: [
        '@happypath',
        '@regressiontest',
        '@patients',
      ],
    },
    async ({
      page,
      patientManagementPage,
    }) => {
      await patientManagementPage.openPatientList();

      await expect(page).toHaveURL(
        new RegExp(`${routes.patients.list}?$`),
      );

      await patientManagementPage.expectPatientListVisible();

      await patientManagementPage.filterPatientsByStatus(
        'DISCHARGED',
      );

      await expect(page).toHaveURL(
        (url) =>
          url.pathname === routes.patients.list &&
          url.searchParams.get('status') ===
            'DISCHARGED',
      );

      await patientManagementPage.expectPatientListVisible();
      await patientManagementPage.expectActiveStatusFilter(
        'DISCHARGED',
      );

      await patientManagementPage.expectPatientRowVisible(
        patientData.updatedFullName,
        'DISCHARGED',
      );
    },
  );
});