import type {
  PatientCreateData,
  PatientUpdateData,
} from '../pages/patients/patient-management.page';

/**
 * Valores permitidos por el selector de género del paciente.
 *
 * Deben coincidir con Patient.Gender en el backend de Django.
 */
export type PatientGender =
  | 'MALE'
  | 'FEMALE'
  | 'OTHER'
  | 'PREFER_NOT_TO_SAY';

/**
 * Agrupa los datos originales y actualizados utilizados
 * por el flujo principal de gestión de pacientes.
 *
 * `createData` contiene la información con la que se registra
 * inicialmente al paciente.
 *
 * `updateData` contiene los valores que se utilizarán después
 * para comprobar la edición.
 */
export interface PatientTestData {
  createData: PatientCreateData;
  updateData: PatientUpdateData;
  originalFullName: string;
  updatedFullName: string;
  visibleBirthDate: string;
  updatedVisibleBirthDate: string;
  visibleGender: string;
  updatedVisibleGender: string;
}

/**
 * Construye datos únicos para registrar y editar un paciente.
 *
 * Se utiliza una combinación de fecha y valor aleatorio para evitar:
 *
 * - Correos duplicados entre diferentes ejecuciones.
 * - Conflictos cuando las pruebas se ejecutan nuevamente.
 * - Dependencia de pacientes creados manualmente.
 *
 * El identificador se mantiene suficientemente corto porque
 * los campos first_name y last_name aceptan un máximo de 20 caracteres.
 */
export function buildPatientTestData(): PatientTestData {
  const uniqueId = buildUniqueId();

  const createData: PatientCreateData = {
    firstName: 'Paciente',
    lastName: `Auto${uniqueId}`,
    email: `paciente.auto.${uniqueId}@example.com`,
    phone: '70001234',
    birthDate: '1998-06-15',
    gender: 'FEMALE',
    address: 'Dirección inicial de prueba automatizada',
    emergencyContactName: 'Contacto Inicial',
    emergencyContactPhone: '70005678',
    chiefComplaint: (
      'Motivo de consulta registrado mediante una prueba automatizada.'
    ),
  };

  const updateData: PatientUpdateData = {
    firstName: 'Paciente',
    lastName: `Edit${uniqueId}`,
    phone: '70008765',
    birthDate: '1997-09-20',
    gender: 'OTHER',
    address: 'Dirección actualizada mediante prueba automatizada',
    emergencyContactName: 'Contacto Actualizado',
    emergencyContactPhone: '70004321',
  };

  return {
    createData,
    updateData,
    originalFullName: (
      `${createData.firstName} ${createData.lastName}`
    ),
    updatedFullName: (
      `${updateData.firstName} ${updateData.lastName}`
    ),
    visibleBirthDate: formatDateForDetail(
      createData.birthDate ?? '',
    ),
    updatedVisibleBirthDate: formatDateForDetail(
      updateData.birthDate ?? '',
    ),
    visibleGender: getVisibleGender(
      createData.gender as PatientGender,
    ),
    updatedVisibleGender: getVisibleGender(
      updateData.gender as PatientGender,
    ),
  };
}

/**
 * Crea un paciente válido con información mínima.
 *
 * Puede utilizarse posteriormente en pruebas que no necesiten
 * verificar todos los campos opcionales.
 */
export function buildMinimalPatientData(): PatientCreateData {
  const uniqueId = buildUniqueId();

  return {
    firstName: 'Paciente',
    lastName: `Min${uniqueId}`,
    email: `paciente.min.${uniqueId}@example.com`,
  };
}

/**
 * Construye datos con una fecha de nacimiento futura.
 *
 * Este objeto será útil para validar que el formulario muestre:
 *
 * "La fecha de nacimiento no puede estar en el futuro."
 */
export function buildPatientWithFutureBirthDate(): PatientCreateData {
  const uniqueId = buildUniqueId();
  const futureDate = new Date();

  futureDate.setFullYear(
    futureDate.getFullYear() + 1,
  );

  return {
    firstName: 'Paciente',
    lastName: `Fecha${uniqueId}`,
    email: `paciente.fecha.${uniqueId}@example.com`,
    birthDate: formatDateForInput(futureDate),
  };
}

/**
 * Construye datos incompletos para el contacto de emergencia.
 *
 * Se proporciona el nombre, pero no el teléfono.
 */
export function buildPatientWithEmergencyNameOnly(): PatientCreateData {
  const uniqueId = buildUniqueId();

  return {
    firstName: 'Paciente',
    lastName: `Emer${uniqueId}`,
    email: `paciente.emer.${uniqueId}@example.com`,
    emergencyContactName: 'Contacto Sin Teléfono',
    emergencyContactPhone: '',
  };
}

/**
 * Construye datos incompletos para el contacto de emergencia.
 *
 * Se proporciona el teléfono, pero no el nombre.
 */
export function buildPatientWithEmergencyPhoneOnly(): PatientCreateData {
  const uniqueId = buildUniqueId();

  return {
    firstName: 'Paciente',
    lastName: `Phone${uniqueId}`,
    email: `paciente.phone.${uniqueId}@example.com`,
    emergencyContactName: '',
    emergencyContactPhone: '70009999',
  };
}

/**
 * Devuelve el texto visible correspondiente a un valor de género.
 */
export function getVisibleGender(
  gender: PatientGender,
): string {
  const visibleGenders: Record<PatientGender, string> = {
    MALE: 'Masculino',
    FEMALE: 'Femenino',
    OTHER: 'Otro',
    PREFER_NOT_TO_SAY: 'Prefiero no decirlo',
  };

  return visibleGenders[gender];
}

/**
 * Convierte una fecha utilizada por un input HTML:
 *
 * YYYY-MM-DD
 *
 * al formato mostrado en el detalle:
 *
 * DD/MM/YYYY
 */
export function formatDateForDetail(
  date: string,
): string {
  if (!date) {
    return '';
  }

  const [
    year,
    month,
    day,
  ] = date.split('-');

  return `${day}/${month}/${year}`;
}

/**
 * Genera un identificador corto y suficientemente único.
 *
 * Ejemplo:
 *
 * 842193
 *
 * Se toman seis dígitos del tiempo actual y se combinan
 * con un valor aleatorio para reducir conflictos.
 */
function buildUniqueId(): string {
  const timestampPart = Date.now()
    .toString()
    .slice(-4);

  const randomPart = Math.floor(
    10 + Math.random() * 90,
  ).toString();

  return `${timestampPart}${randomPart}`;
}

/**
 * Convierte una fecha de JavaScript al formato aceptado
 * por un input HTML de tipo date.
 */
function formatDateForInput(
  date: Date,
): string {
  const year = date.getFullYear();
  const month = padNumber(
    date.getMonth() + 1,
  );
  const day = padNumber(
    date.getDate(),
  );

  return `${year}-${month}-${day}`;
}

/**
 * Agrega un cero al inicio de los números menores que diez.
 */
function padNumber(
  value: number,
): string {
  return value.toString().padStart(2, '0');
}