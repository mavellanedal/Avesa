import { ErrorDto } from '@dtos/common/error.dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Util } from '@shared/utilities/util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message =
      (typeof exceptionResponse === 'object' && exceptionResponse['message']) ||
      exception.message;

    const timestamp = Util.convertUtcDateStringToDate(new Date().toString());
    let errorCode = null;
    let type = undefined;

    if (!Array.isArray(message)) {
      const splitMessage = message?.split('|');

      if (splitMessage?.length > 1) {
        errorCode = splitMessage[0];
        message = splitMessage[1];
        type = isNaN(splitMessage[2]) ? undefined : parseInt(splitMessage[2]);
      }
    }

    const error = new ErrorDto();
    error.status = status;
    error.errorCode = errorCode;
    error.message = message;
    error.timestamp = timestamp;
    error.type = type;

    response.status(status).json(error);
  }
}
