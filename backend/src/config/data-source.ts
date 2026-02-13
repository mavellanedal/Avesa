import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENTITIES } from '../core/entities';

// Cargar variables de entorno manualmente porque Nest no está corriendo
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  entities: [...ENTITIES],

  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
