# Gestor de Tareas con tRPC - CRUD Completo

Una aplicación fullstack que demuestra el **potencial completo de tRPC** implementando un **CRUD (Create, Read, Update, Delete) completo** para un gestor de tareas con validaciones robustas, tipado end-to-end y una API type-safe.

## Tabla de Contenidos

- [Gestor de Tareas con tRPC - CRUD Completo](#gestor-de-tareas-con-trpc---crud-completo)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Requisitos](#requisitos)
  - [Instalación de Dependencias](#instalación-de-dependencias)
  - [Configuración](#configuración)
    - [Estructura de Carpetas](#estructura-de-carpetas)
  - [Ejecución](#ejecución)
    - [Terminal 1 - Inicia el Servidor](#terminal-1---inicia-el-servidor)
    - [Terminal 2 - Ejecuta el Cliente](#terminal-2---ejecuta-el-cliente)
  - [Conceptos Fundamentales](#conceptos-fundamentales)
    - [¿Qué es tRPC?](#qué-es-trpc)
    - [Queries vs Mutations](#queries-vs-mutations)
    - [Validación con Zod](#validación-con-zod)
    - [Type Safety (Tipado Seguro)](#type-safety-tipado-seguro)

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

## Instalación de Dependencias

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

---

## Ejecución

### Terminal 1 - Inicia el Servidor

```bash
npm run server
```

Deberías ver:

```text
Servidor Backend tRPC corriendo en http://localhost:4000
Abre otra terminal y ejecuta: npx tsx src/client.ts
```

### Terminal 2 - Ejecuta el Cliente

En **otra terminal**, en la misma carpeta del proyecto:

```bash
npm run client
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
