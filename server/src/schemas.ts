import { z } from 'zod';

// ============================================
// Esquemas de Validación con Zod
// ============================================

// Esquema para una tarea completa
export const tareaSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  completada: z.boolean(),
  prioridad: z.enum(['baja', 'media', 'alta']),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
});

// Esquema para crear una tarea (input)
export const crearTareaSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  prioridad: z.enum(['baja', 'media', 'alta']).default('media'),
});

// Esquema para actualizar una tarea
export const actualizarTareaSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().min(3).max(100).optional(),
  descripcion: z.string().max(500).optional(),
  completada: z.boolean().optional(),
  prioridad: z.enum(['baja', 'media', 'alta']).optional(),
});

// Esquema para filtrar y ordenar tareas
export const filtroTareasSchema = z.object({
  filtrarPor: z.enum(['todos', 'completadas', 'pendientes']).default('todos'),
  ordenarPor: z.enum(['fecha', 'prioridad', 'titulo']).default('fecha'),
}).optional();
