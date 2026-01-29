import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

export class TypeOrmCustomLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, parameters?: any[]) {
    const params = parameters?.length
      ? ` -- params: ${JSON.stringify(parameters)}`
      : '';
    this.logger.debug(`${query}${params}`);
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    const errMsg = error instanceof Error ? error.message : error;
    const params = parameters?.length
      ? ` -- params: ${JSON.stringify(parameters)}`
      : '';
    this.logger.error(`Query failed: ${query}${params}`);
    this.logger.error(`Error: ${errMsg}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const params = parameters?.length
      ? ` -- params: ${JSON.stringify(parameters)}`
      : '';
    this.logger.warn(`Slow query (${time}ms): ${query}${params}`);
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  logMigration(message: string) {
    this.logger.log(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'warn') this.logger.warn(message);
    else this.logger.log(message);
  }
}
