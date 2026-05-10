import 'reflect-metadata';
import { DataSource, DataSourceOptions, LogLevel } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
import * as process from 'process';

// 1. Importamos tu logger personalizado
import { TypeOrmLogger } from './type-orm-logger';

// 2. Cargamos las variables de entorno de forma nativa con dotenv
const envFile = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : '.env.development';
dotenv.config({ path: envFile });

// 3. Función helper adaptada a process.env
function getLoggingOption(): boolean | 'all' | LogLevel[] {
  const logging = process.env.DB_LOGGING;
  if (!logging || logging === 'false') return false;
  if (logging === 'true') return true;
  if (logging.split(',').length > 1) return logging.split(',') as LogLevel[];
  return 'all';
}

const loggingOptions = getLoggingOption();

// 4. Configuración para PostgreSQL
export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.entity{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: loggingOptions,
  logger: TypeOrmLogger.ForConnection('BBDD', loggingOptions as any),
};

// 6. Inicialización
const AppDataSource = new DataSource(DataSourceConfig);

export default AppDataSource;
