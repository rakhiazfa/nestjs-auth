import { Prisma } from '@prisma/client';

export type PaginationRequest = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  page?: number;
  perPage?: number;
};
