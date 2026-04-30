import {
  HttpException,
  HttpStatus,
  HttpExceptionOptions,
} from '@nestjs/common';

export class ExternalApiException extends HttpException {
  constructor(
    message,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    options?: HttpExceptionOptions,
  ) {
    super(message, status, options);
  }
}

export enum ExternalApiErrors {
  USER_PASSWORD = 'El usuario y/o contraseña no son correctos',
  CREATE_TOKEN = '1 |Hubo un problema al crear el token',
  INSERT_LEAD = '2 |Hubo un problema al crear el lead',
  DUPLICATE_LEAD = '3 |El lead está duplicado',
  SOURCE_NOT_FOUND = '4 |El usuario no tiene un origen válido',
  PHONE_NOT_VALID = '5 |El número de teléfono no es valido',
  PHONE_IN_BLACK_LIST = '6 |El número de teléfono proporcionado no está permitido',
  EMAIL_NOT_VALID = '7 |El email proporcionado no es válido',
  EMAIL_IN_BLACK_LIST = '8 |El email proporcionado no está permitido',
  LEAD_NOT_FOUND = '9 |El lead no existe',
  NOT_ACCESS_RESOURCE = '10 |No tiene acceso a este recurso',
  INSERT_PROPERTY = '11 |Hubo un problema al crear la propiedad',
}
