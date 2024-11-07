import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PaginationQuery } from '../pagination';
import { ApiErrorResponse } from './api-response.dto';

class Header {
  name: string;
  required: boolean;
  description?: string;
}

export function CustomSwaggerResponse(options?: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type?: Type<unknown> | Function | [Function] | string;
  methodType?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  summary?: string;
  isAuthorizedRoute?: boolean;
  isPagination?: boolean;
  headers?: Header[];
}) {
  const swaggerDecorators = [];

  if (!options || !options.hasOwnProperty('isAuthorizedRoute')) {
    options = { ...options, isAuthorizedRoute: true };
  }

  if (options?.description || options?.summary) {
    swaggerDecorators.push(
      ApiOperation({
        description: options?.description,
        summary: options?.summary,
      }),
    );
  }

  if (options?.type && options?.methodType !== 'POST') {
    swaggerDecorators.push(ApiOkResponse({ type: options.type }));
  } else if (options?.type && options?.methodType === 'POST') {
    swaggerDecorators.push(ApiCreatedResponse({ type: options.type }));
  }

  if (options?.isPagination) {
    swaggerDecorators.push(ApiQuery({ type: PaginationQuery }));
  }

  if (options?.isAuthorizedRoute) {
    swaggerDecorators.push(ApiBearerAuth());
  }

  swaggerDecorators.push(
    ApiResponse({
      status: 500,
      type: ApiErrorResponse,
    }),
  );

  return applyDecorators(...swaggerDecorators);
}
