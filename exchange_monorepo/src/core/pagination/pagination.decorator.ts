import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto, PaginationQuery } from '../pagination';

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { pageNo, pageSize } = request.query as PaginationQuery;

    const page = Number(pageNo) > 0 ? Number(pageNo) : 1;
    const size = Number(pageSize) > 0 ? Number(pageSize) : 10;

    const offset = (page - 1) * size;
    const limit = size;

    return {
      pageNo: page,
      pageSize: size,
      offset,
      limit,
    } as PaginationDto;
  },
);
