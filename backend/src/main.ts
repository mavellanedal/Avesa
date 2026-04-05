import 'reflect-metadata';
// import 'winston-daily-rotate-file';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { getMetadataStorage } from 'class-validator';
import { ValidationUtils } from 'class-validator/cjs/validation/ValidationUtils';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { format, transports } from 'winston';
import { UserUtil } from '@shared/utilities/userUtil';
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from '@shared/interceptors/http-exception.filter';
import { ErrorMessages } from '@shared/constants/validations-messages.constant';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      getConfigLoggerOptions(process.env.CONSOLE_LOG === 'true'),
    ),
  });
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(getValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('/api');
  const config = new DocumentBuilder()
    .setTitle('Avesa Api')
    .setVersion('1.0')
    .setDescription('Api from Avesa to work with Leads')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation-api', app, document);

  await app.listen(configService.get<number>('PORT'), '0.0.0.0');
}
bootstrap();

function getConfigLoggerOptions(isConsoleActive: boolean) {
  const commonFormat = (colorize: boolean) =>
    format.combine(
      format.cli(),
      format.splat(),
      format.timestamp({ format: () => new Date().toLocaleString() }),
      format.ms(),
      format.errors({ stack: true }),
      ...(colorize ? [] : [format.uncolorize()]),
      format.printf((info) => getPrintedLine(info)),
    );
  return {
    transports: [
      // new transports.DailyRotateFile({
      new transports.Console({
        // filename: `logs/%DATE%-error.log`,
        level: 'error',
        format: commonFormat(false),
        // datePattern: 'YYYY-MM-DD',
        // zippedArchive: false,
      }),
      // new transports.DailyRotateFile({
      new transports.Console({
        // filename: `logs/%DATE%-all.log`,
        format: commonFormat(false),
        // datePattern: 'YYYY-MM-DD',
        // zippedArchive: false,
      }),
      ...(isConsoleActive
        ? [new transports.Console({ format: commonFormat(true) })]
        : []),
    ],
  };
}

function getPrintedLine(info) {
  const user = UserUtil.getToken() ? `[${UserUtil.getUsername()}] ` : ''; // todo get username from token
  const stack = info.stack ? `\n${info.stack}` : '';
  return `${info.timestamp} - ${process.pid} ${user}[${info.context}] ${info.level}: ${info.message.trimStart()} ${info.ms} ${stack}`;
}

function getValidationPipe() {
  return new ValidationPipe({
    dismissDefaultMessages: true,
    transform: true,
    validationError: { value: true },
    exceptionFactory(rawErrors) {
      const result = [];
      const flattenErrors = (errors) => {
        const flat: any[] = [];

        errors.forEach((err) => {
          if (err.constraints) {
            flat.push(err);
          }
          if (err.children && err.children.length > 0) {
            flat.push(...flattenErrors(err.children));
          }
        });
        return flat;
      };

      const flatErrors = flattenErrors(rawErrors);

      flatErrors.forEach((error) => {
        const validationMetas =
          getMetadataStorage().getTargetValidationMetadatas(
            error.target.constructor,
            error.target.constructor.name,
            true,
            false,
          );

        const validationMeta = validationMetas.find(
          (meta) => meta.propertyName === error.property,
        );

        const validationArguments = {
          targetName: error.target.constructor.name,
          property: error.property,
          value: error.value,
          constraints: validationMeta?.constraints || [],
        };

        const constraintKey = Object.keys(error.constraints)[0];
        let message;

        if (ErrorMessages && ErrorMessages[constraintKey]) {
          message = ValidationUtils.replaceMessageSpecialTokens(
            ErrorMessages[constraintKey],
            validationArguments,
          );
        } else {
          message = `El valor proporcionado para '${error.property}' no es válido.`;
        }

        if (message) {
          result.push(message);
        }
      });

      if (result.length === 0) {
        return new BadRequestException([
          'Se han producido errores de validación en los datos enviados.',
        ]);
      }

      return new BadRequestException(result.length > 1 ? result : result[0]);
    },
  });
}
