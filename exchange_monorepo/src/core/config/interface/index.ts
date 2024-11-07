import { IDatabaseConfigAttributes } from './database';
import { IKycConfigAttributes } from './kyc';
import { IFirebaseConfigAttributes } from './firebase';
import { IServerConfigAttributes } from './server';

export interface IConfig {
  database?: IDatabaseConfigAttributes;
  server?: IServerConfigAttributes;
  kyc?: IKycConfigAttributes;
  firebase?: IFirebaseConfigAttributes;
}
