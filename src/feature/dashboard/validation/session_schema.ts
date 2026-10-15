import { z } from 'zod';

export const createSessionSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre de la sesión es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder los 255 caracteres'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;
