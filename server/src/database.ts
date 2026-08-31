import { Tarea } from '../src/types';

// ============================================
// Base de Datos Simulada en Memoria
// ============================================

// Array que almacena todas las tareas
let listaDeTareas: Tarea[] = [
  {
    id: 1,
    titulo: 'Aprender los fundamentos de la Web',
    descripcion: 'Estudiar HTML, CSS y JavaScript básico',
    completada: false,
    prioridad: 'alta',
    fechaCreacion: new Date('2024-01-01'),
    fechaActualizacion: new Date('2024-01-01'),
  },
  {
    id: 2,
    titulo: 'Aprender Docker',
    descripcion: 'Instalar Docker y crear contenedores para aplicaciones simples',
    completada: false,
    prioridad: 'alta',
    fechaCreacion: new Date('2024-01-02'),
    fechaActualizacion: new Date('2024-01-02'),
  },
];

// Contador para generar IDs únicos
let proximoId = 3;

// ============================================
// Funciones de Base de Datos
// ============================================

// Obtener todas las tareas
export function obtenerTodasLasTareas(): Tarea[] {
  return [...listaDeTareas];
}

// Obtener una tarea por ID
export function obtenerTareaPorId(id: number): Tarea | undefined {
  return listaDeTareas.find((t) => t.id === id);
}

// Crear una nueva tarea
export function crearTarea(datos: {
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta';
}): Tarea {
  const nuevaTarea: Tarea = {
    id: proximoId++,
    titulo: datos.titulo,
    descripcion: datos.descripcion || '',
    completada: false,
    prioridad: datos.prioridad,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  };
  listaDeTareas.push(nuevaTarea);
  return nuevaTarea;
}

// Actualizar una tarea existente
export function actualizarTarea(
  id: number,
  cambios: {
    titulo?: string;
    descripcion?: string;
    completada?: boolean;
    prioridad?: 'baja' | 'media' | 'alta';
  },
): Tarea | null {
  const tareaIndex = listaDeTareas.findIndex((t) => t.id === id);
  if (tareaIndex === -1) {
    return null;
  }

  const tareaActualizada: Tarea = {
    ...listaDeTareas[tareaIndex],
    ...(cambios.titulo && { titulo: cambios.titulo }),
    ...(cambios.descripcion !== undefined && {
      descripcion: cambios.descripcion,
    }),
    ...(cambios.completada !== undefined && { completada: cambios.completada }),
    ...(cambios.prioridad && { prioridad: cambios.prioridad }),
    fechaActualizacion: new Date(),
  };

  listaDeTareas[tareaIndex] = tareaActualizada;
  return tareaActualizada;
}

// Eliminar una tarea
export function eliminarTarea(id: number): Tarea | undefined {
  const tareaIndex = listaDeTareas.findIndex((t) => t.id === id);
  if (tareaIndex === -1) {
    return undefined;
  }

  const [tareaEliminada] = listaDeTareas.splice(tareaIndex, 1);
  return tareaEliminada;
}

// Marcar tarea como completada
export function completarTarea(id: number): Tarea | null {
  const tarea = listaDeTareas.find((t) => t.id === id);
  if (!tarea) {
    return null;
  }

  tarea.completada = true;
  tarea.fechaActualizacion = new Date();
  return tarea;
}

// Limpiar todas las tareas completadas
export function limpiarTareasCompletadas(): number {
  const cantidadAnterior = listaDeTareas.length;
  const indicesAEliminar = listaDeTareas
    .map((t, i) => (t.completada ? i : -1))
    .filter((i) => i !== -1)
    .reverse();

  indicesAEliminar.forEach((i) => listaDeTareas.splice(i, 1));

  return cantidadAnterior - listaDeTareas.length;
}

// Obtener estadísticas
export function obtenerEstadisticas() {
  return {
    total: listaDeTareas.length,
    completadas: listaDeTareas.filter((t) => t.completada).length,
    pendientes: listaDeTareas.filter((t) => !t.completada).length,
    porPrioridad: {
      alta: listaDeTareas.filter((t) => t.prioridad === 'alta').length,
      media: listaDeTareas.filter((t) => t.prioridad === 'media').length,
      baja: listaDeTareas.filter((t) => t.prioridad === 'baja').length,
    },
  };
}
