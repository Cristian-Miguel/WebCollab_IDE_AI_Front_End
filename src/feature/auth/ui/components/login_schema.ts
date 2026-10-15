import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(16, 'La contraseña no puede exceder 16 caracteres.'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
