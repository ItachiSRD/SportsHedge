import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as crypto from 'crypto';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AADHAR_ERROR_CODES,
  BANK_ACCOUNT_ERROR_CODES,
  DL_ERROR_CODES,
  KYC_DOC_TYPE,
  PAN_ERROR_CODES,
} from '../../core/constant';
import {
  AadharKycDto,
  AadharOtpDto,
  BankDto,
  DrivingLicenseDto,
  PanDto,
} from '../../modules/users/dto/kyc.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KycService {
  private kycPassword: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.kycPassword = this.configService.get('KYC_PASS');
  }

  /**
   * Encrypt data using AES Cipher (CBC) with 128 bit key
   * @param type plainText - data to encrypt
   * @return encrypted data in base64 encoding
   */
  encrypt(plainText) {
    const iv = crypto.randomBytes(16);
    const hash = crypto.createHash('sha512');
    const dataKey = hash.update(this.kycPassword, 'utf-8');
    const genHash = dataKey.digest('hex');
    const key = genHash.substring(0, 16);
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), iv);
    let requestData = cipher.update(plainText, 'utf-8', 'base64');
    requestData +=
      cipher.final('base64') + ':' + Buffer.from(iv).toString('base64');
    return requestData;
  }

  /**
   * Decrypt data using AES Cipher (CBC) with 128 bit key
   * @param type encText - data to be decrypted in base64 encoding
   * @return decrypted data
   */
  decrypt(encText) {
    const m = crypto.createHash('sha512');
    const datakey = m.update(this.kycPassword, 'utf-8');
    const genHash = datakey.digest('hex');
    const key = genHash.substring(0, 16);
    const result = encText.split(':');
    const iv = Buffer.from(result[1], 'base64');
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      Buffer.from(key),
      iv,
    );
    let decoded = decipher.update(result[0], 'base64', 'utf8');
    decoded += decipher.final('utf8');
    return JSON.parse(decoded);
  }

  handleKycError(data: any, errorCodes: { [key: string]: any }) {
    const err = new Error(errorCodes.VERIFICATION_FAILED.msg);
    if (data.status in errorCodes) {
      const errorObj = errorCodes[data.status];
      err.message = errorObj.msg;
      err.name = errorObj.code;
      err['data'] = data;
    }
    return err;
  }

  async getAadharOtp(transId: string, aadharKycDto: AadharKycDto) {
    const payload = {
      docType: KYC_DOC_TYPE.AADHAR,
      aadharNo: aadharKycDto.aadharNumber,
      transId: transId,
    };

    const encPayload = this.encrypt(JSON.stringify(payload));
    const { data } = await firstValueFrom(
      this.httpService
        .post('/v1/apicall/nid/aadhar_get_otp', {
          requestData: encPayload,
        })
        .pipe(
          catchError((error: AxiosError<{ responseData: string }>) => {
            const errorResponse = this.decrypt(
              error.response.data.responseData,
            );
            console.log(
              'Failed to generate otp for Aadhar verification',
              errorResponse,
            );
            throw this.handleKycError(errorResponse, AADHAR_ERROR_CODES);
          }),
        ),
    );

    const decData = this.decrypt(data.responseData);

    // Verification sucessful
    if (decData.status === 1) {
      return decData;
    }

    // Verification failed
    throw this.handleKycError(decData, AADHAR_ERROR_CODES);
  }

  async submitAadharOtp(aadharOtpDto: AadharOtpDto) {
    const encPayload = this.encrypt(
      JSON.stringify({
        transId: aadharOtpDto.transId,
        otp: parseInt(aadharOtpDto.otp),
      }),
    );
    const { data } = await firstValueFrom(
      this.httpService
        .post('/v1/apicall/nid/aadhar_submit_otp', {
          requestData: encPayload,
        })
        .pipe(
          catchError((error: AxiosError<{ responseData: string }>) => {
            const errorResponse = this.decrypt(
              error.response.data.responseData,
            );
            console.log('Failed to verify aadhar', errorResponse);
            throw this.handleKycError(errorResponse, AADHAR_ERROR_CODES);
          }),
        ),
    );
    const decData = this.decrypt(data.responseData);

    // Verification sucessful
    if (decData.status === 1) {
      return decData;
    }

    // Verification failed
    throw this.handleKycError(decData, AADHAR_ERROR_CODES);
  }

  async idSearch(encPayload: string, errorCodes: { [key: string]: any }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post('/api/v2.2/idsearch', {
          requestData: encPayload,
        })
        .pipe(
          catchError((error: AxiosError<{ responseData: string }>) => {
            const errorResponse = this.decrypt(
              error.response.data.responseData,
            );
            throw this.handleKycError(errorResponse, errorCodes);
          }),
        ),
    );

    const decData = this.decrypt(data.responseData);
    return decData;
  }

  async submitDrivingLicense(transId: string, dlDto: DrivingLicenseDto) {
    const payload = {
      transID: transId,
      docType: KYC_DOC_TYPE.DRIVING_LICENSE,
      docNumber: dlDto.licenseNumber,
      dob: dlDto.dob,
    };

    const encPayload = this.encrypt(JSON.stringify(payload));
    const data = await this.idSearch(encPayload, DL_ERROR_CODES);

    // Verification sucessful
    if (data.status === 1) {
      return data;
    }

    // Verification failed
    throw this.handleKycError(data, DL_ERROR_CODES);
  }

  async submitPanCard(transId: string, panDto: PanDto) {
    const payload = {
      transID: transId,
      docType: KYC_DOC_TYPE.PAN_CARD,
      docNumber: panDto.panNumber,
    };

    const encPayload = this.encrypt(JSON.stringify(payload));
    const data = await this.idSearch(encPayload, PAN_ERROR_CODES);

    // Verification sucessful
    if (data.status === 1) {
      return data;
    }

    // Verification failed
    throw this.handleKycError(data, PAN_ERROR_CODES);
  }

  async submitBankAccount(transID: string, bankDto: BankDto) {
    const payload = {
      transID,
      docType: KYC_DOC_TYPE.BANK_ACCOUNT,
      beneAccNo: bankDto.accountNo,
      ifsc: bankDto.ifsc.toUpperCase(),
    };

    const encPayload = this.encrypt(JSON.stringify(payload));

    const { data } = await firstValueFrom(
      this.httpService
        .post('/BankAccountVerificationApi', {
          requestData: encPayload,
        })
        .pipe(
          catchError((error: AxiosError<{ responseData: string }>) => {
            const errorResponse = this.decrypt(
              error.response.data.responseData,
            );
            throw this.handleKycError(errorResponse, BANK_ACCOUNT_ERROR_CODES);
          }),
        ),
    );

    const decData = this.decrypt(data.responseData);

    // Verification sucessful
    if (decData.status === 1) {
      return decData;
    }

    // Verification failed
    throw this.handleKycError(decData, BANK_ACCOUNT_ERROR_CODES);
  }
}
