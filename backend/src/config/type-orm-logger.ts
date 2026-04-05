import { Logger as ITypeOrmLogger } from 'typeorm';
import { LoggerOptions as TypeOrmLoggerOptions } from 'typeorm/logger/LoggerOptions';
import { Logger } from '@nestjs/common';

export class TypeOrmLogger implements ITypeOrmLogger {
  static ForConnection(connectionName: string, options: TypeOrmLoggerOptions) {
    const logger = new Logger(`TypeORM[${connectionName}]`);
    return new TypeOrmLogger(logger, options);
  }

  constructor(
    private readonly logger: Logger,
    private readonly options: TypeOrmLoggerOptions,
  ) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[]) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.includes('query'))
    ) {
      let sql = query;
      if (parameters && parameters.length > 0) {
        sql += ` -- PARAMETERS: ${this.stringifyParams(parameters)}`;
      }
      this.logger.log(`query: ${sql}`);
    }
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: string, query: string, parameters?: any[]) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.includes('error'))
    ) {
      let sql = query;
      if (parameters && parameters.length > 0) {
        sql += ` -- PARAMETERS: ${this.stringifyParams(parameters)}`;
      }
      this.logger.error(`query failed: ${sql}`);
      this.logger.error(`error: ${error}`);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    let sql = query;
    if (parameters && parameters.length > 0) {
      sql += ` -- PARAMETERS: ${this.stringifyParams(parameters)}`;
    }
    this.logger.warn(`query is slow: ${sql}`);
    this.logger.warn(`execution time: ${time}`);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string) {
    if (
      this.options === 'all' ||
      (Array.isArray(this.options) && this.options.includes('schema'))
    ) {
      this.logger.log(message);
    }
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string) {
    this.logger.log(message);
  }

  /**
   * Perform logging using given logger, or by default to the this.logger.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.includes('log'))
        ) {
          this.logger.log(message);
        }
        break;
      case 'info':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.includes('info'))
        ) {
          this.logger.debug(message);
        }
        break;
      case 'warn':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.includes('warn'))
        ) {
          this.logger.warn(message);
        }
        break;
    }
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefore we are handling this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters;
    }
  }
}
