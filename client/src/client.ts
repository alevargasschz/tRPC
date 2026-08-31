import { createTRPCClient, httpBatchLink } from '@trpc/client';
// Importamos únicamente el TIPO del servidor (No trae código del backend al frontend)
import type { AppRouter } from '../../server/src/server';

// 1. Configurar el cliente apuntando al servidor backend
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000',
    }),
  ],
});

async function ejecutarDemo() {
  try {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  DEMO CRUD COMPLETO CON tRPC - Gestor de Tareas       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // ========== READ: Obtener todas las tareas ==========
    console.log('[READ] Consultando tareas iniciales...');
    const tareasIniciales = await client.obtenerTareas.query();
    console.log(`✓ Se encontraron ${tareasIniciales.length} tareas:\n`);
    tareasIniciales.forEach((t) => {
      console.log(`  • ID ${t.id}: "${t.titulo}" [Prioridad: ${t.prioridad}]`);
    });

    // ========== READ: Obtener una tarea específica ==========
    console.log('\n[READ] Obteniendo tarea con ID 1...');
    const tareaEspecifica = await client.obtenerTarea.query(1);
    console.log(`✓ Tarea encontrada:`);
    console.log(`  Título: ${tareaEspecifica.titulo}`);
    console.log(`  Descripción: ${tareaEspecifica.descripcion}`);
    console.log(`  Completada: ${tareaEspecifica.completada}`);
    console.log(`  Prioridad: ${tareaEspecifica.prioridad}`);

    // ========== READ: Obtener estadísticas ==========
    console.log('\n[READ] Obteniendo estadísticas...');
    const stats = await client.obtenerEstadisticas.query();
    console.log(`✓ Estadísticas:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Completadas: ${stats.completadas}`);
    console.log(`  Pendientes: ${stats.pendientes}`);
    console.log(
      `  Por prioridad: Alta=${stats.porPrioridad.alta}, Media=${stats.porPrioridad.media}, Baja=${stats.porPrioridad.baja}`,
    );

    // ========== CREATE: Crear una nueva tarea ==========
    console.log('\n[CREATE] Creando nueva tarea...');
    const nuevaTarea = await client.crearTarea.mutate({
      titulo: 'Tarea de Matemáticas Avanzadas',
      descripcion: 'Resolver problemas de álgebra y cálculo',
      prioridad: 'alta',
    });
    console.log(`✓ Tarea creada exitosamente:`);
    console.log(`  ID: ${nuevaTarea.tarea.id}`);
    console.log(`  Título: ${nuevaTarea.tarea.titulo}\n`);

    // ========== CREATE: Crear otra tarea ==========
    console.log('[CREATE] Creando segunda tarea...');
    const otraTarea = await client.crearTarea.mutate({
      titulo: 'Tarea de Fisica Experimental',
      descripcion: 'Realizar el experimento de caída libre y registrar resultados',
      prioridad: 'media',
    });
    console.log(
      `✓ Segunda tarea creada: ID ${otraTarea.tarea.id} - "${otraTarea.tarea.titulo}"\n`,
    );

    // ========== UPDATE: Actualizar una tarea ==========
    console.log('[UPDATE] Actualizando tarea con ID 2...');
    const tareaActualizada = await client.actualizarTarea.mutate({
      id: 2,
      titulo: 'Exposición de Filosofia y Ética',
      descripcion: 'Preparar la presentación',
      completada: false,
      prioridad: 'alta',
    });
    console.log(`✓ Tarea actualizada:`);
    console.log(`  Nuevo título: ${tareaActualizada.tarea.titulo}\n`);

    // ========== UPDATE: Marcar como completada ==========
    console.log('[UPDATE] Marcando tarea ID 1 como completada...');
    const tareaCompletada = await client.completarTarea.mutate(1);
    console.log(`✓ Tarea completada: "${tareaCompletada.tarea.titulo}"\n`);

    // ========== READ: Obtener con filtro y ordenamiento ==========
    console.log(
      '[READ] Obteniendo tareas PENDIENTES ordenadas por prioridad...',
    );
    const tareasPendientes = await client.obtenerTareas.query({
      filtrarPor: 'pendientes',
      ordenarPor: 'prioridad',
    });
    console.log(
      `✓ Se encontraron ${tareasPendientes.length} tareas pendientes:`,
    );
    tareasPendientes.forEach((t) => {
      console.log(`  • "${t.titulo}" [${t.prioridad}]`);
    });

    // ========== READ: Obtener solo completadas ==========
    console.log('\n[READ] Obteniendo tareas COMPLETADAS...');
    const tareasCompletadas = await client.obtenerTareas.query({
      filtrarPor: 'completadas',
    });
    console.log(
      `✓ Se encontraron ${tareasCompletadas.length} tareas completadas:`,
    );
    tareasCompletadas.forEach((t) => {
      console.log(`  ✓ "${t.titulo}"`);
    });

    // ========== DELETE: Eliminar una tarea ==========
    console.log('\n[DELETE] Eliminando tarea con ID 3...');
    const respuestaEliminar = await client.eliminarTarea.mutate(3);
    console.log(
      `✓ Tarea eliminada: "${respuestaEliminar.tareaEliminada.titulo}"\n`,
    );

    // ========== READ: Listar todas las tareas finales ==========
    console.log('[READ] Listado final de todas las tareas...');
    const tareasFinal = await client.obtenerTareas.query();
    console.log(`✓ Total de tareas: ${tareasFinal.length}\n`);
    tareasFinal.forEach((t) => {
      const estado = t.completada ? '[COMPLETADA]' : '[PENDIENTE]';
      console.log(`  ${estado} ID ${t.id}: "${t.titulo}" [${t.prioridad}]`);
    });

    // ========== UPDATE: Limpiar completadas ==========
    console.log('\n[MAINTENANCE] Limpiando todas las tareas completadas...');
    const limpiar = await client.limpiarCompletadas.mutate();
    console.log(
      `✓ Se eliminaron ${limpiar.eliminadas} tarea(s) completada(s)\n`,
    );

    // ========== READ: Estadísticas finales ==========
    console.log('[READ] Estadísticas finales...');
    const statsFinal = await client.obtenerEstadisticas.query();
    console.log(`✓ Total: ${statsFinal.total}`);
    console.log(`  Pendientes: ${statsFinal.pendientes}`);
    console.log(`  Completadas: ${statsFinal.completadas}`);

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         DEMO COMPLETADA EXITOSAMENTE                  ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
  } catch (error) {
    console.error('ERROR en la demo:', error);
  }
}

ejecutarDemo();
