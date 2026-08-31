import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../trpc';
import { TaskService } from '../../tasks.service';
import { TaskPriority } from '../../../../core/domain/task.domain';

const taskService = new TaskService();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  isCompleted: z.boolean().default(false),
  priority: z.enum([TaskPriority.BAJA, TaskPriority.MEDIA, TaskPriority.ALTA]).default(TaskPriority.MEDIA),
});

const updateTaskSchema = createTaskSchema.partial();

const idSchema = z.object({
  id: z.string(),
});

export const tasksRouter = createTRPCRouter({
  /**
   * Crear una nueva tarea
   */
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ input }) => {
      try {
        const task = await taskService.create(input);
        return {
          success: true,
          data: task,
        };
      } catch (error) {
        throw new Error(`Error al crear la tarea: ${(error as Error).message}`);
      }
    }),

  /**
   * Obtener todas las tareas
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const tasks = await taskService.findAll();
        return {
          success: true,
          data: tasks,
        };
      } catch (error) {
        throw new Error(`Error al obtener las tareas: ${(error as Error).message}`);
      }
    }),

  /**
   * Obtener una tarea por ID
   */
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input }) => {
      try {
        const task = await taskService.findById(input.id);
        if (!task) {
          throw new Error('Tarea no encontrada');
        }
        return {
          success: true,
          data: task,
        };
      } catch (error) {
        throw new Error(`Error al obtener la tarea: ${(error as Error).message}`);
      }
    }),

  /**
   * Actualizar una tarea
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateTaskSchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        const task = await taskService.updateById(
          input.id,
          input.data as any
        );
        if (!task) {
          throw new Error('Tarea no encontrada');
        }
        return {
          success: true,
          data: task,
        };
      } catch (error) {
        throw new Error(`Error al actualizar la tarea: ${(error as Error).message}`);
      }
    }),

  /**
   * Eliminar una tarea
   */
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input }) => {
      try {
        const task = await taskService.deleteById(input.id);
        if (!task) {
          throw new Error('Tarea no encontrada');
        }
        return {
          success: true,
          message: 'Tarea eliminada correctamente',
        };
      } catch (error) {
        throw new Error(`Error al eliminar la tarea: ${(error as Error).message}`);
      }
    }),
});
