export type UserRole =
  | 'ADMIN'
  | 'PSYCHOLOGIST'
  | 'PATIENT'
  | 'INACTIVE';

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Obtiene las credenciales configuradas para un tipo de usuario.
 *
 * @param role Rol cuyas credenciales se desean obtener.
 * @returns Correo y contraseña del usuario.
 */
export function getCredentials(role: UserRole): Credentials {
  const emailVariable = `${role}_USER_EMAIL`;
  const passwordVariable = `${role}_USER_PASSWORD`;

  const email = process.env[emailVariable];
  const password = process.env[passwordVariable];

  if (!email || !password) {
    throw new Error(
      `Faltan ${emailVariable} o ${passwordVariable} en el archivo .env`
    );
  }

  return { email, password };
}