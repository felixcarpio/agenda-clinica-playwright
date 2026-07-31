export interface SlotData {
  date: string;
  start: Date;
  end: Date;
  startDateTime: string;
  endDateTime: string;
  startTime: string;
  endTime: string;
}

/**
 * Convierte una fecha al formato requerido por datetime-local.
 *
 * Ejemplo: 2027-02-02T09:00
 */
export function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convierte una fecha al formato YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());

  return `${year}-${month}-${day}`;
}

/**
 * Convierte una hora al formato HH:mm.
 */
export function formatTime(date: Date): string {
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());

  return `${hours}:${minutes}`;
}

/**
 * Construye los datos completos de un cupo a partir de dos fechas.
 */
export function buildSlotData(start: Date, end: Date): SlotData {
  return {
    date: formatDate(start),
    start,
    end,
    startDateTime: formatDateTimeLocal(start),
    endDateTime: formatDateTimeLocal(end),
    startTime: formatTime(start),
    endTime: formatTime(end),
  };
}

/**
 * Genera un cupo futuro compartido entre escenarios.
 *
 * El horario base será de 9:00 a. m. a 10:00 a. m.
 */
export function buildFutureSlot(): SlotData {
  const now = new Date();
  const daysAhead = 30 + (now.getTime() % 180);

  const start = new Date(now);
  start.setDate(start.getDate() + daysAhead);
  start.setHours(9, 0, 0, 0);

  const end = new Date(start);
  end.setHours(10, 0, 0, 0);

  return buildSlotData(start, end);
}

/**
 * Desplaza el horario completo de un cupo.
 *
 * @param slot Cupo original.
 * @param hours Cantidad de horas que se agregarán.
 */
export function shiftSlotHours(
  slot: SlotData,
  hours: number
): SlotData {
  const updatedStart = new Date(slot.start);
  updatedStart.setHours(updatedStart.getHours() + hours);

  const updatedEnd = new Date(slot.end);
  updatedEnd.setHours(updatedEnd.getHours() + hours);

  return buildSlotData(updatedStart, updatedEnd);
}

/**
 * Agrega un cero a la izquierda cuando el número es menor que diez.
 */
function padNumber(value: number): string {
  return String(value).padStart(2, '0');
}