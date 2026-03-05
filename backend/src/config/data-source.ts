import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ENTITIES } from '../core/entities';

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || 'development'}`,
  ),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  entities: [...ENTITIES],

  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
