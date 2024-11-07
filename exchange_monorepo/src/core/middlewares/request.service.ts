import { Injectable, Scope, Global } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Global()
@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private firebaseUserDecoded: DecodedIdToken;

  setUser(user: DecodedIdToken) {
    this.firebaseUserDecoded = user;
  }

  getUser() {
    return this.firebaseUserDecoded;
  }
}
