import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import * as crypto from 'crypto';

declare module 'express' {
  interface Request {
    rawBody: Buffer;
  }
}

@Injectable()
export class AuthLive implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('signat', req.headers['signature']);
    if (!req.headers['signature']) {
      throw new UnauthorizedException();
    }

    const signature = Buffer.from(req.headers['signature'], 'base64');
    const payload = (req as any).rawBody;
    const publicKeyObject = crypto.createPublicKey({
      key: Buffer.from(process.env.ED255_PUBLIC_KEY, 'base64'),
      format: 'der',
      type: 'spki',
    });

    const isValid = crypto.verify(null, payload, publicKeyObject, signature);

    if (!isValid) {
      throw new UnauthorizedException();
    }
    next();
  }
}
