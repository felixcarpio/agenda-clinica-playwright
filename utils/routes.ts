/**
 * Rutas principales utilizadas por las pruebas.
 *
 * Se centralizan para evitar repetir valores
 * y facilitar futuros cambios en las URLs.
 */
export const routes = {
  login: '/accounts/login/',

  dashboards: {
    admin: '/dashboard/administracion',
    patient: '/dashboard/paciente',
    psychologist: '/dashboard/psicologo',
  },

  psychologist: {
    availabilitySlots: '/mis-cupos/',
    createAvailabilitySlot: '/mis-cupos/nuevo/',
  },
  patients: {
    list: '/mis-pacientes/',
    create: '/mis-pacientes/nuevo/',
    created: '/mis-pacientes/nuevo/creado/',
  },
} as const;