import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter, type AppRouter } from './procedures';

// ============================================
// Crear y encender el servidor HTTP
// ============================================

const server = createHTTPServer({
  router: appRouter,
});

server.listen(4000);
console.log('Servidor Backend tRPC corriendo en http://localhost:4000');
console.log('Abre otra terminal y ejecuta: npx tsx src/client.ts');

// Exportar tipo del enrutador para el Frontend
export type { AppRouter };
