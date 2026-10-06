import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(16, 'La contraseña no puede exceder los 16 caracteres.'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;