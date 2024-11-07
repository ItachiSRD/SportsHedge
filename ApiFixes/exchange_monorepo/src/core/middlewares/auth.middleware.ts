import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { ERROR_CODES, ERROR_MSG } from '../constant';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private excludedRoutes = ['public', 'operations'];
  async use(req: Request, res: Response, next: NextFunction) {
    // exclude all routes that are public
    if (
      this.excludedRoutes.some(
        (excludedRoute) => req.originalUrl?.includes(excludedRoute),
      )
    ) {
      return next();
    }

    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        message: ERROR_MSG.USER_AUTH_MISSING,
        error_code: ERROR_CODES.UNAUTHORIZED_1,
      });
    }

    let decodedToken = null;
    const accessToken = authorizationHeader.substring(7);

    try {
      decodedToken = await admin.auth().verifyIdToken(accessToken);
    } catch (error) {
      if (error.errorInfo?.code === 'auth/id-token-expired') {
        throw new UnauthorizedException({
          message: ERROR_MSG.USER_TOKEN_EXPIRED,
          error_code: ERROR_CODES.UNAUTHORIZED_2,
        });
      }

      if (error.errorInfo?.code === 'auth/argument-error') {
        throw new UnauthorizedException({
          message: ERROR_MSG.USER_INVALID_TOKEN,
          error_code: ERROR_CODES.UNAUTHORIZED_4,
        });
      }

      console.error(error, error.stack);

      if (error.codePrefix !== 'auth') {
        throw error;
      }

      throw new UnauthorizedException({
        message: ERROR_MSG.USER_UNAUTHORIZED,
        error_code: ERROR_CODES.UNAUTHORIZED_3,
      });
    }

    res.locals.user = decodedToken;
    return next();
  }
}
