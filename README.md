# Gestor de tareas con tRPC

Aplicación fullstack para administrar tareas mediante una API construida con **tRPC**, un servidor en **Node.js + Express**, persistencia en **MongoDB** y una interfaz en **React + Vite**.
El proyecto demuestra un CRUD completo con tipado end-to-end: los procedimientos definidos en el servidor se conocen automáticamente en el cliente gracias a TypeScript.

## Contenido

- [Gestor de tareas con tRPC](#gestor-de-tareas-con-trpc)
  - [Contenido](#contenido)
  - [Requisitos](#requisitos)
  - [Arquitectura del proyecto](#arquitectura-del-proyecto)
  - [Configuración](#configuración)
    - [1. Descargar el proyecto](#1-descargar-el-proyecto)
    - [2. Iniciar MongoDB](#2-iniciar-mongodb)
    - [3. Instalar dependencias](#3-instalar-dependencias)
  - [Ejecución de la demo](#ejecución-de-la-demo)
    - [Terminal 1: MongoDB](#terminal-1-mongodb)
    - [Terminal 2: servidor tRPC](#terminal-2-servidor-trpc)
    - [Terminal 3: cliente React](#terminal-3-cliente-react)
  - [Procedimientos tRPC](#procedimientos-trpc)
  - [Conceptos utilizados](#conceptos-utilizados)
    - [¿Qué es tRPC?](#qué-es-trpc)
    - [Queries y mutations](#queries-y-mutations)
    - [Validación con Zod](#validación-con-zod)
    - [Tipado end-to-end](#tipado-end-to-end)
    - [Batching y conexión del cliente](#batching-y-conexión-del-cliente)
    - [Persistencia y separación de responsabilidades](#persistencia-y-separación-de-responsabilidades)

## Requisitos

Instala las siguientes herramientas antes de comenzar:

- **Node.js 20.6 o superior** y npm. El servidor utiliza `process.loadEnvFile()` para cargar las variables de entorno.
- **Docker Desktop**, con Docker Compose habilitado, para ejecutar MongoDB.
- Un navegador web y, opcionalmente, **VS Code**.

Comprueba las versiones desde una terminal:

```bash
node --version
npm --version
docker --version
docker compose version
```

## Arquitectura del proyecto

```text
tRPC/
├── docker-compose.yml              # Servicio MongoDB
├── server/
│   ├── .env                         # Configuración local del servidor
│   └── src/
│       ├── index.ts                 # Servidor Express y endpoint /trpc
│       ├── config/connectionDB.ts  # Conexión con MongoDB
│       ├── core/domain/             # Dominio y prioridades de las tareas
│       └── features/tasks/
│           ├── tasks.service.ts     # Operaciones de persistencia
│           └── trpc/
│               ├── context.ts
│               ├── trpc.ts
│               └── routers/          # Procedimientos tRPC
└── client/react-ts/
    └── src/
        ├── lib/trpc.ts             # Cliente tRPC tipado
        └── components/             # Formulario y lista de tareas
```

## Configuración

### 1. Descargar el proyecto

Clona el repositorio o abre la carpeta del proyecto en VS Code y sitúate en su raíz:

```bash
cd tRPC
```

### 2. Iniciar MongoDB

Desde la raíz del proyecto ejecuta:

```bash
docker compose up -d
```

El archivo `docker-compose.yml` crea un contenedor llamado `mongo` con estos datos:

| Dato | Valor |
| --- | --- |
| Host | `localhost` |
| Puerto publicado | `27018` |
| Usuario | `admin` |
| Contraseña | `admin123` |
| Base de datos | `task_manager` |

El servidor ya incluye `server/.env` con la configuración necesaria:

```env
PORT=3001
MONGO_URI=mongodb://admin:admin123@localhost:27018/task_manager?authSource=admin
```

### 3. Instalar dependencias

El backend y el frontend tienen sus propios `package.json`, por lo que las dependencias se instalan por separado.

En una terminal:

```bash
cd server
npm install
```

En otra terminal:

```bash
cd client/react-ts
npm install
```

## Ejecución de la demo

La aplicación requiere tres procesos: MongoDB, el servidor tRPC y el cliente React.

### Terminal 1: MongoDB

Si todavía no lo iniciaste:

```bash
docker compose up -d
```

### Terminal 2: servidor tRPC

Desde `server/` ejecuta:

```bash
npm run dev
```

Cuando la conexión sea correcta, el servidor estará disponible en:

- API tRPC: `http://localhost:3001/trpc`
- Comprobación de salud: `http://localhost:3001/health`

### Terminal 3: cliente React

Desde `client/react-ts/` ejecuta:

```bash
npm run dev
```

Abre la URL que muestre Vite, normalmente `http://localhost:5173`. Desde la interfaz puedes crear tareas, consultar la lista, actualizar su estado/prioridad y eliminarlas.

Para detener MongoDB al terminar la demo:

```bash
docker compose down
```

## Procedimientos tRPC

El router principal se encuentra en `server/src/features/tasks/trpc/routers/_app.ts` y monta `tasksRouter`. El endpoint HTTP común es `/trpc`, pero cada operación se identifica por su procedimiento:

| Procedimiento | Tipo | Entrada | Función |
| --- | --- | --- | --- |
| `tasks.getAll` | Query | Ninguna | Obtiene todas las tareas |
| `tasks.getById` | Query | `{ id: string }` | Obtiene una tarea por su ID |
| `tasks.create` | Mutation | `title`, `description`, `isCompleted` y `priority` | Crea una tarea |
| `tasks.update` | Mutation | `{ id, data }` | Actualiza parcialmente una tarea |
| `tasks.delete` | Mutation | `{ id: string }` | Elimina una tarea |

Las prioridades válidas son `Baja`, `Media` y `Alta`. `isCompleted` tiene `false` como valor predeterminado en la creación. Las entradas se validan con Zod; por ejemplo, título y descripción son obligatorios al crear una tarea.

El cliente no construye manualmente las rutas ni los tipos. Usa el router importado desde el servidor:

```typescript
const tasks = trpc.tasks.getAll.useQuery();

const createTask = trpc.tasks.create.useMutation();
await createTask.mutateAsync({
  title: 'Estudiar tRPC',
  description: 'Revisar queries y mutations',
  isCompleted: false,
  priority: 'Media',
});
```

## Conceptos utilizados

### ¿Qué es tRPC?

tRPC permite exponer procedimientos del servidor y consumirlos desde TypeScript sin definir manualmente controladores REST, DTO duplicados ni un archivo OpenAPI. El tipo `AppRouter` funciona como contrato compartido entre backend y frontend.

En este proyecto, `createExpressMiddleware` conecta el router tRPC con Express en `/trpc`. Las solicitudes HTTP siguen existiendo internamente, pero el desarrollador trabaja con procedimientos tipados como `tasks.create` o `tasks.getAll`.

### Queries y mutations

- **Query:** consulta información sin modificarla. Aquí se utilizan `tasks.getAll` y `tasks.getById`.
- **Mutation:** crea, modifica o elimina información. Aquí se utilizan `tasks.create`, `tasks.update` y `tasks.delete`.

En React, `@trpc/react-query` ofrece `useQuery` y `useMutation`, mientras que TanStack Query gestiona estados de carga, errores, caché y actualización de datos. Después de crear una tarea, el formulario invalida `tasks.getAll` para refrescar la lista.

### Validación con Zod

Cada procedimiento declara un esquema de entrada con Zod antes de ejecutar la lógica del servicio. Por ejemplo, la creación valida que `title` y `description` sean cadenas no vacías y que `priority` pertenezca al conjunto permitido. Si la entrada no cumple el esquema, tRPC rechaza la solicitud antes de acceder a MongoDB.

### Tipado end-to-end

El cliente importa `AppRouter` desde el servidor:

```typescript
import type { AppRouter } from '../../../../server/src/features/tasks/trpc/routers/_app';
```

Por eso el editor conoce los procedimientos, sus parámetros y sus respuestas. Un nombre de procedimiento incorrecto o un campo inválido produce un error de TypeScript durante el desarrollo, antes de llegar al servidor.

### Batching y conexión del cliente

`httpBatchLink` configura la comunicación del cliente con `http://localhost:3001/trpc` y permite agrupar solicitudes compatibles. La integración se completa envolviendo la aplicación con `QueryClientProvider` y `trpc.Provider` en `client/react-ts/src/main.tsx`.

### Persistencia y separación de responsabilidades

Express se encarga del servidor HTTP, tRPC de los procedimientos y su contrato tipado, Zod de validar entradas, `TaskService` de la lógica de tareas y Mongoose de la persistencia en MongoDB. Esta separación facilita entender y mantener cada parte de la aplicación.
