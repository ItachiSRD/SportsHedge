import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_STATES } from '../../core/constant/payment';
import { PayAPIRequest, PaymentInstrumentType } from './phonepe.types';
import { PaymentInitiateRequest } from '../../modules/users/dto/users.dto';

// const crypto = require('crypto');

@Injectable()
export class PhonepeService {
  private baseUrl: string;
  private merchantId: string;
  private redirectUrl: string;
  private callbackUrl: string;
  private saltKey: string;
  private saltIndex: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('PHONEPE_BASE_URL');
    this.merchantId = this.configService.get('PHONEPE_MERCHANT_ID');
    this.redirectUrl = this.configService.get('PAYMENT_REDIRECT_URL');
    this.callbackUrl = this.configService.get('PAYMENT_CALLBACK_URL');
    this.saltKey = this.configService.get('PHONEPE_SALT_KEY');
    this.saltIndex = this.configService.get('PHONEPE_SALT_INDEX');
  }

  createXHeader = (route: string, payload?: PayAPIRequest) => {
    const combination = payload ? payload + route : route;

    const encoded = this.encodeRequest(combination + this.saltKey);
    return encoded + '###' + this.saltIndex;
  };

  initiatePayment = async (
    userId: string,
    req: PaymentInitiateRequest,
    transactionId: string,
  ) => {
    //  1. Create the Payload
    const payload: PayAPIRequest = {
      merchantId: this.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: req.amount,
      callbackUrl: this.callbackUrl,
      deviceContext: {
        deviceOS: req.deviceOS,
      },
      paymentInstrument: {
        type: PaymentInstrumentType[req.type],
        targetApp: req.targetApp,
      },
    };

    //  2. Create Header and Encode Payload
    const url = 'pg/v1/pay';
    const xheader = this.createXHeader(url, payload);
    const encodedPayload = {
      request: this.encodeRequest(payload),
    };

    //  3. Call Pay API
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.baseUrl}/${url}`, encodedPayload, {
          headers: {
            'X-VERIFY': xheader,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new Error('Cannot Connect to PhonePe');
          }),
        ),
    );

    //  4. Handle Output
    const output = data.data;
    if (output.code != PAYMENT_STATES.PAYMENT_INITIATED) {
      //  TODO: How to handle this error?
      throw new Error('Payment Failed');
    }

    return output.data.instrumentResponse.redirectInfo.url;
  };

  encodeRequest = (payload: any) => {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  };

  getStatus = async (orderId: string) => {
    const url = `/pg/v1/status/${this.merchantId}/${orderId}`;
    const xheader = this.createXHeader(url);

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.baseUrl}/${url}/${this.merchantId}/${orderId}`, {
          headers: {
            'X-VERIFY': xheader,
            'Content-Type': 'application/json',
            'X-MERCHANT-ID': this.merchantId,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new Error('Cannot Connect to PhonePe');
          }),
        ),
    );

    return data.data;
  };

  //   signRequest = (payload) => {
  //     return crypto.createHash('sha256').update(payload).digest('hex');
  //   };
}
