import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,16}$/;

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Escribe tu nombre completo.').max(50, 'El nombre no puede superar 50 caracteres.'),
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
  birthDate: z.string().min(1, 'Selecciona tu fecha de nacimiento.'),
  password: z.string()
    .min(8, 'Usa entre 8 y 16 caracteres.')
    .max(16, 'Usa entre 8 y 16 caracteres.')
    .regex(PASSWORD_REGEX, 'Incluye mayúscula, minúscula, número y un símbolo.'),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;
