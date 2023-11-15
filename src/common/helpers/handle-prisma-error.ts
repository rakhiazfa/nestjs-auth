import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handlePrismaClientKnownRequestError(error) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const column: string = (error?.meta?.target as string).split('_')[1];

        throw new BadRequestException(`${column} already exists.`);
      case 'P2025':
        throw new NotFoundException(error.meta.cause);
      default:
        throw new InternalServerErrorException(error);
    }
  } else {
    throw new InternalServerErrorException(error);
  }
}
