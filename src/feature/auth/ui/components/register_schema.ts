import { z } from 'zod';

// Patrón para una contraseña segura (minúscula, mayúscula, número, carácter especial)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;
// Patrón básico para RFC (12 o 13 caracteres alfanuméricos)
const RFC_REGEX = /^[A-Z&Ññ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z0-9]{2}[0-9A]$/i;
// Patrón básico para CURP (18 caracteres alfanuméricos)
const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/i;


// Esquema de la dirección
const AddressSchema = z.object({
  street: z.string().min(3, 'Campo requerido.'),
  internalNumber: z.string().optional(),
  externalNumber: z.string().min(1, 'Campo requerido.'),
  colony: z.string().min(3, 'Campo requerido.'),
  locality: z.string().min(3, 'Campo requerido.'),
  municipality: z.string().min(3, 'Campo requerido.'),
  state: z.string().min(2, 'Campo requerido.'),
  postalCode: z.string().regex(/^\d{5}$/, 'Debe ser un código postal válido de 5 dígitos.'),
  country: z.string().min(2, 'Campo requerido.'),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  password: z.string()
    .min(8, 'Debe tener entre 8 y 16 caracteres.')
    .max(16, 'Debe tener entre 8 y 16 caracteres.')
    .regex(PASSWORD_REGEX, 'Debe incluir mayúscula, minúscula, número y carácter especial.'),
  confirmPassword: z.string(),
  fullName: z.string().min(5, 'El nombre completo es requerido.'),
  rfc: z.string()
    .min(12, 'El RFC debe tener entre 12 y 13 caracteres.')
    .max(13, 'El RFC debe tener entre 12 y 13 caracteres.')
    .regex(RFC_REGEX, 'Estructura RFC no válida.'),
  curp: z.string()
    .length(18, 'La CURP debe tener 18 caracteres.')
    .regex(CURP_REGEX, 'Estructura CURP no válida.'),
  dateOfBirth: z.string().min(1, 'Fecha de nacimiento requerida.'),
  profileImage: z.instanceof(FileList).refine(files => files.length > 0, 'Imagen de perfil requerida.'),
  address: AddressSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;