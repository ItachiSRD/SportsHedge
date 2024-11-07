import * as dotenv from 'dotenv';
import { IConfig } from './interface';
import { IDatabaseConfigAttributes } from './interface/database';
import { IFirebaseConfigAttributes } from './interface/firebase';
import { IServerConfigAttributes } from './interface/server';
import { IKycConfigAttributes } from './interface/kyc';
import { SHBooks } from './config.interfaces';

dotenv.config();
//  TODO: Use Config Service
//  TODO: Validate env variables

export const databaseConfig: IDatabaseConfigAttributes = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT,
};

export const SHBOOKS: SHBooks = {
  CASH: process.env.BOOK_CASH,
  MAIN: process.env.BOOK_SH_MAIN,
  LOCK: process.env.BOOK_SH_LOCK,
  FEES: process.env.BOOK_SH_FEES,
  TCS: process.env.BOOK_SH_TCS,
  TDS: process.env.BOOK_SH_TDS,
};

export const serverConfig: IServerConfigAttributes = {
  basePath: '/api',
  port: Number(process.env.SERV_HTTP_PORT),
  keepAliveMs: 305 * 1000, // should more than alb's idle timeout
};

export const kycConfig: IKycConfigAttributes = {
  username: process.env.KYC_USER,
  password: process.env.KYC_PASS,
  host: process.env.KYC_PROVIDER_HOST,
};

export const firebaseConfig: IFirebaseConfigAttributes = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

export const config: IConfig = {
  database: databaseConfig,
  server: serverConfig,
  kyc: kycConfig,
  firebase: firebaseConfig,
};

// ledger service config
export const ledgerConfig = {
  baseUrl: process.env.LEDGER_URL,
};
