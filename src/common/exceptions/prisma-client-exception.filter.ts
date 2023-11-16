import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { capitalizeFirstLetter } from '../helpers/capitalize-first-letter';
import { error } from 'console';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        this.responseException(response, {
          message:
            capitalizeFirstLetter(
              (exception.meta?.target as string).split('_')[1],
            ) + ' already exists.',
          error: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
        });
        break;
      case 'P2025':
        this.responseException(response, {
          message: exception?.meta?.cause as string,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }

  private responseException(
    response: Response,
    {
      message,
      error,
      statusCode,
    }: {
      message: string;
      error: string;
      statusCode: number;
    },
  ) {
    response.status(statusCode).json({
      message,
      error,
      statusCode,
    });
  }
}
