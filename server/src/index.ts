import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { db } from './config/connectionDB';
import { appRouter } from './features/tasks/trpc/routers/_app';
import { createContext } from './features/tasks/trpc/context';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Initialize database and start server
db.then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor tRPC corriendo en http://localhost:${PORT}`);
    console.log(`tRPC endpoint: http://localhost:${PORT}/trpc`);
  });
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
  process.exit(1);
});
