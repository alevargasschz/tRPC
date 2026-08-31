import { z } from 'zod';
import { tareaSchema } from './schemas';

// ============================================
// Tipos TypeScript Exportables
// ============================================

// Tipo Tarea derivado del esquema Zod
export type Tarea = z.infer<typeof tareaSchema>;

// Tipo para respuestas estándar de operaciones
export type RespuestaOperacion<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
