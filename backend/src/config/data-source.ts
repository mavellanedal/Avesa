import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENTITIES } from '../core/entities';

// Cargar variables de entorno manualmente porque Nest no está corriendo
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  // Usamos las mismas entidades que la App
  entities: [...ENTITIES],

  // Configuración de Migraciones
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  synchronize: false, // ¡SIEMPRE FALSE EN PRODUCCIÓN!
  logging: process.env.NODE_ENV !== 'production',
});
