import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { ERROR_CODES, ERROR_MSG } from '../constant';
import { ValidationError } from 'class-validator';

interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  error_code: string;
  path: string;
  timestamp: string;
}

/**
 * This will catch all 400 - 500 types errors, and automatically format logs to include better meaningful details
 * Wrap every controller with this, so that it can automatically catch any unexpected error that are not being caught.
 * Otherwise, uncaught errors will take the server down, unless caught using process.on('uncaught)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new PinoLogger({});

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Add better logging of request, preferably using req id, exception will be printed with trace id.
    this.logger.error(request);

    const response = host.switchToHttp().getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse: ErrorResponse = {
      success: false,
      message: String(exception),
      error: ERROR_MSG.INTERNAL_SERVER_ERROR,
      error_code: ERROR_CODES.UNKNOWN,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse.error = exception.name;
      errorResponse.message = exception.message;

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        const { message, error_code } = exceptionResponse as any;
        if (message && error_code) {
          errorResponse.message = message;
          errorResponse.error_code = error_code;
        }
      }

      return response.status(status).json(errorResponse);
    }

    if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
      const errorMessages: string[] = [];

      for (const error of exception) {
        for (const messageKey in error.constraints) {
          if (error.constraints.hasOwnProperty(messageKey)) {
            errorMessages.push(error.constraints[messageKey]);
          }
        }
      }

      status = 400;
      errorResponse.error = 'InputValidationError';
      errorResponse.message = errorMessages.join(', ');
      errorResponse.error_code = 'INVALID_INPUT';
      return response.status(status).json(errorResponse);
    }

    this.logger.error(exception);
    return response.status(status).json(errorResponse);
  }
}
