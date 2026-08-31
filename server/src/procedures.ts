import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  crearTareaSchema,
  actualizarTareaSchema,
  filtroTareasSchema,
} from './schemas';
import * as db from './database';

// ============================================
// Inicializar tRPC
// ============================================

const t = initTRPC.create();

// ============================================
// Definir los Procedimientos (Queries y Mutations)
// ============================================

export const appRouter = t.router({
  // ========== QUERIES (Lectura) ==========

  // Obtener todas las tareas con filtro y ordenamiento
  obtenerTareas: t.procedure
    .input(filtroTareasSchema)
    .query(({ input }) => {
      let tareasFiltradas = db.obtenerTodasLasTareas();

      // Filtrar según el criterio
      if (input?.filtrarPor === 'completadas') {
        tareasFiltradas = tareasFiltradas.filter((t) => t.completada);
      } else if (input?.filtrarPor === 'pendientes') {
        tareasFiltradas = tareasFiltradas.filter((t) => !t.completada);
      }

      // Ordenar según el criterio
      if (input?.ordenarPor === 'prioridad') {
        const prioridades = { alta: 3, media: 2, baja: 1 };
        tareasFiltradas.sort(
          (a, b) => prioridades[b.prioridad] - prioridades[a.prioridad]
        );
      } else if (input?.ordenarPor === 'titulo') {
        tareasFiltradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
      } else {
        tareasFiltradas.sort(
          (a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
        );
      }

      return tareasFiltradas;
    }),

  // Obtener una tarea específica por ID
  obtenerTarea: t.procedure
    .input(z.number().int().positive('El ID debe ser un número positivo'))
    .query(({ input }) => {
      const tarea = db.obtenerTareaPorId(input);
      if (!tarea) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarea con ID ${input} no encontrada`,
        });
      }
      return tarea;
    }),

  // Obtener estadísticas
  obtenerEstadisticas: t.procedure.query(() => {
    return db.obtenerEstadisticas();
  }),

  // ========== MUTATIONS (Escritura) ==========

  // Crear una nueva tarea
  crearTarea: t.procedure
    .input(crearTareaSchema)
    .mutation(({ input }) => {
      const tarea = db.crearTarea(input);
      return { success: true, tarea };
    }),

  // Actualizar una tarea existente
  actualizarTarea: t.procedure
    .input(actualizarTareaSchema)
    .mutation(({ input }) => {
      const tareaActualizada = db.actualizarTarea(input.id, {
        titulo: input.titulo,
        descripcion: input.descripcion,
        completada: input.completada,
        prioridad: input.prioridad,
      });

      if (!tareaActualizada) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarea con ID ${input.id} no encontrada`,
        });
      }

      return { success: true, tarea: tareaActualizada };
    }),

  // Eliminar una tarea
  eliminarTarea: t.procedure
    .input(z.number().int().positive())
    .mutation(({ input }) => {
      const tareaEliminada = db.eliminarTarea(input);

      if (!tareaEliminada) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarea con ID ${input} no encontrada`,
        });
      }

      return { success: true, tareaEliminada };
    }),

  // Marcar una tarea como completada
  completarTarea: t.procedure
    .input(z.number().int().positive())
    .mutation(({ input }) => {
      const tarea = db.completarTarea(input);

      if (!tarea) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarea con ID ${input} no encontrada`,
        });
      }

      return { success: true, tarea };
    }),

  // Limpiar todas las tareas completadas
  limpiarCompletadas: t.procedure.mutation(() => {
    const eliminadas = db.limpiarTareasCompletadas();
    return {
      success: true,
      eliminadas,
    };
  }),
});

// Exportamos el tipo del enrutador para el Frontend
export type AppRouter = typeof appRouter;
