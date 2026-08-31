# tRPC API Documentation

## Overview
Este servidor implementa tRPC (TypeScript Remote Procedure Call), un framework para crear APIs end-to-end type-safe.

## Endpoints

El servidor expone tRPC en: `http://localhost:3000/trpc`

### Tasks API

#### 1. Crear Tarea
```
Procedure: tasks.create
Method: POST
```

**Input:**
```typescript
{
  title: string;
  description: string;
  isCompleted?: boolean; // default: false
  priority?: 'Baja' | 'Media' | 'Alta'; // default: 'Media'
}
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/trpc/tasks.create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Mi tarea',
    description: 'Descripción de la tarea',
    priority: 'Alta'
  })
});
const data = await response.json();
```

#### 2. Obtener Todas las Tareas
```
Procedure: tasks.getAll
Method: GET
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/trpc/tasks.getAll');
const data = await response.json();
```

#### 3. Obtener Tarea por ID
```
Procedure: tasks.getById
Method: GET
```

**Input:**
```typescript
{
  id: string; // MongoDB ObjectId
}
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/trpc/tasks.getById?input={"id":"123abc"}');
const data = await response.json();
```

#### 4. Actualizar Tarea
```
Procedure: tasks.update
Method: POST
```

**Input:**
```typescript
{
  id: string;
  data: {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    priority?: 'Baja' | 'Media' | 'Alta';
  }
}
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/trpc/tasks.update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '123abc',
    data: {
      isCompleted: true
    }
  })
});
const data = await response.json();
```

#### 5. Eliminar Tarea
```
Procedure: tasks.delete
Method: POST
```

**Input:**
```typescript
{
  id: string;
}
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/trpc/tasks.delete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: '123abc' })
});
const data = await response.json();
```

## Usando el Cliente tRPC (Recomendado)

### Instalación en Cliente
```bash
npm install @trpc/client @trpc/server zod
```

### Ejemplo de Cliente
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/trpc/routers/_app';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Crear tarea
const newTask = await trpc.tasks.create.mutate({
  title: 'Nueva tarea',
  description: 'Descripción',
  priority: 'Alta'
});

// Obtener todas las tareas
const tasks = await trpc.tasks.getAll.query();

// Obtener tarea por ID
const task = await trpc.tasks.getById.query({ id: '123abc' });

// Actualizar tarea
const updated = await trpc.tasks.update.mutate({
  id: '123abc',
  data: { isCompleted: true }
});

// Eliminar tarea
const deleted = await trpc.tasks.delete.mutate({ id: '123abc' });
```

## Respuestas

Todas las respuestas están en formato JSON con la siguiente estructura:

**Success:**
```json
{
  "result": {
    "data": {
      "success": true,
      "data": { /* task data */ }
    }
  }
}
```

**Error:**
```json
{
  "error": {
    "json": {
      "message": "Descripción del error",
      "code": "INTERNAL_SERVER_ERROR"
    }
  }
}
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor compilado

## Validación

Todas las entradas están validadas con Zod. Los errores de validación se devuelven con detalles específicos sobre qué campo falló.

## Seguridad

En producción, se recomienda:
1. Agregar autenticación/autorización
2. Limitar CORS a dominios específicos
3. Implementar rate limiting
4. Usar HTTPS
