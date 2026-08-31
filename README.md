# Gestor de Tareas con tRPC - CRUD Completo

Una aplicación fullstack que demuestra el **potencial completo de tRPC** implementando un **CRUD (Create, Read, Update, Delete) completo** para un gestor de tareas con validaciones robustas, tipado end-to-end y una API type-safe.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Conceptos Fundamentales](#conceptos-fundamentales)
- [Operaciones CRUD Implementadas](#operaciones-crud-implementadas)
- [Características Destacadas](#características-destacadas)

---

## Requisitos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js** versión 16 o superior ([Descargar](https://nodejs.org/))
- **npm** (generalmente viene con Node.js)
- Un editor de código como **VS Code**

Para verificar que los tienes instalados, ejecuta en tu terminal:

```bash
node --version
npm --version
```

---

## Instalación

### Paso 1: Clonar o Descargar el Proyecto

Si aún no tienes el proyecto, descárgalo o clona el repositorio:

```bash
git clone <url-del-repositorio>
cd tRPC
```

### Paso 2: Instalar Dependencias

Ejecuta el siguiente comando en la carpeta raíz del proyecto:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:

- `@trpc/server` - Framework tRPC backend
- `@trpc/client` - Cliente tRPC
- `zod` - Validación de esquemas
- `typescript` - Tipado estático
- `tsx` - Ejecutor de archivos TypeScript

---

## Configuración

### Estructura de Carpetas

```text
tRPC/
├──server/ 
│   └──src/
│       ├── server.ts          # Punto de entrada: configura e inicia el servidor HTTP
│       ├── procedures.ts      # Define queries y mutations de la API tRPC
│       ├── database.ts        # Funciones de base de datos simulada
│       ├── schemas.ts         # Esquemas de validación con Zod
│       └── types.ts           # Tipos TypeScript exportables
├──client/
│   └──src/
│       └── client.ts          # Cliente que consume la API tRPC
├── package.json           # Dependencias del proyecto
├── tsconfig.json          # Configuración TypeScript
└── README.md              # Este archivo
```

### Archivo `tsconfig.json`

Ya está configurado para compilar TypeScript a JavaScript moderno. No necesitas cambios adicionales.

### Archivo `package.json`

Contiene:

- **dependencies**: Librerías necesarias para producción
- **devDependencies**: Herramientas de desarrollo
- **scripts**: Comandos para ejecutar la aplicación

---

## Ejecución

### Opción 1: Ejecución Manual (Recomendada)

#### Terminal 1 - Inicia el Servidor

```bash
npx tsx src/server.ts
```

Deberías ver:

```text
Servidor Backend tRPC corriendo en http://localhost:4000
Abre otra terminal y ejecuta: npx tsx src/client.ts
```

#### Terminal 2 - Ejecuta el Cliente

En **otra terminal**, en la misma carpeta del proyecto:

```bash
npx tsx src/client.ts
```

Verás la salida completa del CRUD demostrativo:

```text
═════════════════════════════════════════════════════════
  DEMO CRUD COMPLETO CON tRPC - Gestor de Tareas
═════════════════════════════════════════════════════════

[READ] Consultando tareas iniciales...
✓ Se encontraron 2 tareas:

  • ID 2: "Preparar la exposición de tRPC" [Prioridad: alta]
  • ID 1: "Aprender los fundamentos de la Web" [Prioridad: alta]
  ...
```

### Opción 2: Ejecutar Ambos Simultáneamente

Si tienes un entorno que lo permite (como VS Code con múltiples terminales):

```bash
# Terminal 1
npx tsx src/server.ts

# Terminal 2 (simultáneamente)
npx tsx src/client.ts
```

---

## Estructura del Proyecto

### Arquitectura Modular

El proyecto utiliza una **arquitectura modular y escalable**, separando responsabilidades en diferentes archivos:

#### `src/schemas.ts` - Esquemas de Validación

Contiene todos los esquemas Zod que definen la estructura y validación de datos:

```typescript
- tareaSchema          // Estructura completa de una tarea
- crearTareaSchema    // Validación para crear tareas
- actualizarTareaSchema // Validación para actualizar tareas
- filtroTareasSchema  // Validación para filtros y ordenamiento
```

**Beneficio:** Centraliza la validación en un solo lugar, facilitando cambios y mantenimiento.

#### `src/types.ts` - Tipos TypeScript

Contiene los tipos TypeScript derivados de los esquemas Zod:

```typescript
- Tarea              // Tipo completo de una tarea
- RespuestaOperacion // Tipo genérico para respuestas
```

**Beneficio:** Proporciona type-safety sin duplicación de código.

#### `src/database.ts` - Base de Datos Simulada

Contiene toda la lógica de manipulación de datos:

```typescript
- obtenerTodasLasTareas()   // Obtiene todas las tareas
- obtenerTareaPorId()       // Obtiene una tarea específica
- crearTarea()              // Crea una nueva tarea
- actualizarTarea()         // Actualiza una tarea existente
- eliminarTarea()           // Elimina una tarea
- completarTarea()          // Marca como completada
- limpiarTareasCompletadas() // Elimina completadas
- obtenerEstadisticas()     // Calcula estadísticas
```

**Beneficio:** Abstrae la lógica de datos, permitiendo cambiar a una BD real sin modificar los procedimientos.

#### `src/procedures.ts` - Procedimientos tRPC

Define el router y todos los procedimientos (queries y mutations):

```typescript
appRouter = t.router({
  // Queries (lectura)
  obtenerTareas
  obtenerTarea
  obtenerEstadisticas
  
  // Mutations (escritura)
  crearTarea
  actualizarTarea
  eliminarTarea
  completarTarea
  limpiarCompletadas
})
```

**Beneficio:** Mantiene la lógica de tRPC limpia y enfocada.

#### `src/server.ts` - Punto de Entrada

Archivo principal que inicia el servidor HTTP:

```typescript
- Importa el router de procedures
- Crea el servidor HTTP
- Escucha en puerto 4000
- Exporta el tipo AppRouter para el cliente
```

**Beneficio:** Muy simple y legible, solo 15 líneas de código.

#### `src/client.ts` - Cliente tRPC

Consume la API tRPC y ejecuta la demostración:

```typescript
- Importa el tipo AppRouter
- Crea el cliente HTTP
- Ejecuta todos los CRUD operations
```

**Beneficio:** Totalmente desacoplado del servidor, puede ir en otro repositorio.

---

## Conceptos Fundamentales

### ¿Qué es tRPC?

tRPC es un framework que permite crear **APIs type-safe** sin necesidad de:

- ✗ Escribir esquemas REST (GET, POST, PUT, DELETE)
- ✗ Documentar endpoints manualmente
- ✗ Validar tipos en tiempo de runtime

En su lugar, ofrece:

- ✓ Tipado end-to-end automático
- ✓ Autocompletado completo en el cliente
- ✓ Validación de datos con Zod
- ✓ Errores detectados en desarrollo

### Queries vs Mutations

| Query | Mutation |
| ------- | ---------- |
| Lee datos sin cambiar estado | Escribe o modifica datos |
| Puede cachearse | No se cachea |
| Equivalente a GET en REST | Equivalente a POST/PUT/DELETE |
| Ejemplo: `obtenerTareas` | Ejemplo: `crearTarea`, `actualizarTarea` |

### Validación con Zod

Zod asegura que los datos sean válidos **antes** de procesarlos:

```typescript
const crearTareaSchema = z.object({
  titulo: z.string().min(3).max(100),              // String de 3-100 caracteres
  descripcion: z.string().max(500).optional(),    // Optional
  prioridad: z.enum(['baja', 'media', 'alta'])    // Solo estos valores
});
```

Si envías datos inválidos, tRPC rechaza la solicitud automáticamente.

### Type Safety (Tipado Seguro)

Cuando importas `AppRouter` en el cliente:

```typescript
import type { AppRouter } from './server';

const client = createTRPCClient<AppRouter>({ ... });

// TypeScript SABE exactamente qué devuelve obtenerTareas
const tareas = await client.obtenerTareas.query();
// tareas es de tipo Tarea[] automáticamente ✓

// Si escribes mal:
const resultado = await client.obtenerTareass.query();
// Error de compilación ✗
```

---

## Operaciones CRUD Implementadas

### CREATE - Crear Tareas

**Procedimiento:** `crearTarea`

```typescript
const nuevaTarea = await client.crearTarea.mutate({
  titulo: 'Mi tarea',
  descripcion: 'Descripción opcional',
  prioridad: 'alta'
});
```

**Validaciones:**

- Título: 3-100 caracteres (requerido)
- Descripción: máximo 500 caracteres (opcional)
- Prioridad: `baja`, `media` o `alta`

**Respuesta:**

```typescript
{
  success: true,
  tarea: {
    id: 3,
    titulo: 'Mi tarea',
    descripcion: 'Descripción opcional',
    completada: false,
    prioridad: 'alta',
    fechaCreacion: Date,
    fechaActualizacion: Date
  }
}
```

### READ - Leer Tareas

#### 1. Obtener todas las tareas

```typescript
const tareas = await client.obtenerTareas.query();
```

Con filtro y ordenamiento:

```typescript
const tareasPendientes = await client.obtenerTareas.query({
  filtrarPor: 'pendientes',      // 'todos' | 'completadas' | 'pendientes'
  ordenarPor: 'prioridad'        // 'fecha' | 'prioridad' | 'titulo'
});
```

#### 2. Obtener una tarea específica

```typescript
const tarea = await client.obtenerTarea.query(1);  // Por ID
```

Si la tarea no existe:

```typescript
{
  code: 'NOT_FOUND',
  message: 'Tarea con ID 1 no encontrada'
}
```

#### 3. Obtener estadísticas

```typescript
const stats = await client.obtenerEstadisticas.query();

// Respuesta:
{
  total: 5,
  completadas: 2,
  pendientes: 3,
  porPrioridad: {
    alta: 2,
    media: 2,
    baja: 1
  }
}
```

### UPDATE - Actualizar Tareas

#### 1. Actualizar campos específicos

```typescript
const tareaActualizada = await client.actualizarTarea.mutate({
  id: 2,                    // Requerido
  titulo: 'Nuevo título',   // Opcional
  prioridad: 'media',       // Opcional
  completada: true          // Opcional
});
```

Solo actualiza los campos que envíes, los demás se mantienen igual.

#### 2. Marcar como completada

```typescript
const tarea = await client.completarTarea.mutate(2);  // Por ID
```

Equivalente a:

```typescript
await client.actualizarTarea.mutate({
  id: 2,
  completada: true
});
```

### DELETE - Eliminar Tareas

#### 1. Eliminar una tarea específica

```typescript
const tareaEliminada = await client.eliminarTarea.mutate(3);  // Por ID
```

#### 2. Limpiar todas las completadas

```typescript
const resultado = await client.limpiarCompletadas.mutate();

// Respuesta:
{
  success: true,
  eliminadas: 5  // Número de tareas eliminadas
}
```

---

## Características Destacadas

### 1. Validación Automática

Todos los inputs se validan automáticamente con Zod:

```typescript
// Esto falla (título muy corto)
await client.crearTarea.mutate({
  titulo: 'ab'  // Menos de 3 caracteres
});
// Error: 'El título debe tener al menos 3 caracteres'

// Esto falla (prioridad inválida)
await client.crearTarea.mutate({
  titulo: 'Mi tarea',
  prioridad: 'urgente'  // No es 'baja', 'media' o 'alta'
});
// Error: Invalid enum value
```

### 2. Manejo de Errores

Las operaciones que no encuentran registros lanzan errores descriptivos:

```typescript
try {
  await client.obtenerTarea.query(999);
} catch (error) {
  console.log(error.message);  // 'Tarea con ID 999 no encontrada'
}
```

### 3. Timestamps Automáticos

Cada tarea tiene:

- `fechaCreacion`: Se asigna cuando se crea
- `fechaActualizacion`: Se actualiza automáticamente en cada cambio

### 4. Filtrado y Ordenamiento

```typescript
// Filtrar tareas pendientes ordenadas por prioridad
const tareas = await client.obtenerTareas.query({
  filtrarPor: 'pendientes',
  ordenarPor: 'prioridad'
});

// Tareas completadas ordenadas alfabéticamente
const tareas2 = await client.obtenerTareas.query({
  filtrarPor: 'completadas',
  ordenarPor: 'titulo'
});
```

### 5. Type Safety Completo

```typescript
// ✓ Autocompletado disponible
client.obtenerTareas.     // <- VS Code sugiere 'query'
client.crearTarea.        // <- VS Code sugiere 'mutate'

// ✓ Errores de compilación en desarrollo
const resultado = await client.obtenerTareass.query();  // Error: typo

// ✓ Tipos inferidos automáticamente
const tarea = await client.obtenerTarea.query(1);
// tarea es de tipo Tarea | undefined automáticamente
```

---

## Flujo de Ejecución de la Demo

La demostración en `client.ts` ejecuta las siguientes operaciones en orden:

1. **[READ]** Obtiene todas las tareas iniciales
2. **[READ]** Obtiene una tarea específica por ID
3. **[READ]** Obtiene estadísticas globales
4. **[CREATE]** Crea una nueva tarea
5. **[CREATE]** Crea otra tarea más
6. **[UPDATE]** Actualiza una tarea existente
7. **[UPDATE]** Marca una tarea como completada
8. **[READ]** Obtiene tareas pendientes ordenadas por prioridad
9. **[READ]** Obtiene solo tareas completadas
10. **[DELETE]** Elimina una tarea específica
11. **[READ]** Lista todas las tareas finales
12. **[MAINTENANCE]** Limpia todas las tareas completadas
13. **[READ]** Muestra estadísticas finales

---

## Extensiones Posibles

Puedes mejorar esta aplicación:

1. **Persistencia en Base de Datos**
   - Cambiar el array en memoria por una base de datos real
   - Ejemplo: MongoDB, PostgreSQL, MySQL

2. **Autenticación**
   - Agregar usuarios y login
   - Contexto de tRPC para usuario actual

3. **Paginación**
   - Limitar resultados por página
   - Implementar offset y limit

4. **Búsqueda**
   - Filtrar tareas por texto en título
   - Búsqueda full-text

5. **Interface Gráfica**
   - Crear un frontend con React/Vue
   - Usar el mismo cliente tRPC

---

## Troubleshooting

### Error: `Cannot find module '@trpc/server'`

**Solución:** Instala las dependencias:

```bash
npm install
```

### Error: `Port 4000 already in use`

**Solución:** El puerto 4000 está ocupado. Cambia el puerto en `server.ts`:

```typescript
server.listen(5000);  // Cambiar de 4000 a 5000
```

Y en `client.ts`:

```typescript
httpBatchLink({
  url: 'http://localhost:5000',  // Cambiar aquí también
}),
```

### El cliente se conecta pero no devuelve datos

**Verificar:**

1. El servidor está corriendo (`npx tsx src/server.ts`)
2. El puerto coincide en ambos archivos
3. No hay errores en la consola del servidor

---

## Referencias

- **tRPC Documentation:** <https://trpc.io/docs>
- **Zod Documentation:** <https://zod.dev>
- **TypeScript Handbook:** <https://www.typescriptlang.org/docs>

---

## Autor

Alejandro Vargas Sánchez
COMPUNET 3 - SEMESTRE 7

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
