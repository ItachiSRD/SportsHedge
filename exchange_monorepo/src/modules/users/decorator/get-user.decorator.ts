import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getResponse<Response>();
    return res.locals.user;
  },
);
