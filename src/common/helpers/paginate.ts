import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';

export const paginate: PaginatorTypes.PaginateFunction = paginator({
  perPage: 15,
});
