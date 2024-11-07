import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { ERROR_CODES, ERROR_MSG, MESSAGES } from '../constant';
import { PaginationQuery, PaginationResponse } from '../pagination';

interface ValidResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationResponse;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ValidResponse<T>>
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ValidResponse<T>> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { pageNo } = request.query as PaginationQuery;

    return next.handle().pipe(
      map((data: any) => {
        const res = data;

        if (res === null || res === undefined) {
          throw new InternalServerErrorException({
            message: ERROR_MSG.INTERNAL_SERVER_ERROR,
            error_code: ERROR_CODES.EMPTY_RESPONSE,
          });
        }

        // Check for array and add pagination object to response
        let pagination: PaginationResponse = null;
        if (Array.isArray(res)) {
          pagination = {
            pageNo: Number(pageNo) || 1,
            pageSize: res.length,
          };
        }

        const validResponse: ValidResponse<T> = {
          success: true,
          message: MESSAGES.DEFAULT,
          data: res,
        };
        if (pagination) {
          validResponse['pagination'] = pagination;
        }

        return validResponse;
      }),
    );
  }
}
