export enum PaymentInstrumentType {
  UPI_INTENT = 'UPI_INTENT',
}

export type PayAPIRequest = {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  callbackUrl: string;
  deviceContext: {
    deviceOS: string;
  };
  mobileNumber?: string;
  paymentInstrument: {
    type: PaymentInstrumentType;
    targetApp: string;
  };
};
