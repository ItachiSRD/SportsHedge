import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Books, Fees, Instrument } from './types';
import { Exchange } from '../../modules/update-orders/types';
import { SHBOOKS } from '../../core/config';
import { Holdings } from '../../modules/users/dto/users.dto';

const instrumentsToUpper = (balances: any) => {
  const modifiedBalances = {};
  for (const instrument in balances) {
    modifiedBalances[instrument.toUpperCase()] = balances[instrument];
  }
  return modifiedBalances;
};

@Injectable()
export class LedgerService {
  private baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('LEDGER_URL');
  }

  //  Create Lock and Main Books for the User
  // createBooks = async (userId: string) => {
  //   const { data: main } = await firstValueFrom(
  //     this.httpService
  //       .post(`${this.baseUrl}/books`, {
  //         name: `${userId}_main`,
  //         metadata: 'User Main book',
  //         restrictions: {
  //           minBalance: 0,
  //         },
  //       })
  //       .pipe(
  //         catchError((error: AxiosError) => {
  //           console.error(error.response.data);
  //           throw new Error('Cannot create Main Book');
  //         }),
  //       ),
  //   );

  //   const { data: lock } = await firstValueFrom(
  //     this.httpService
  //       .post(`${this.baseUrl}/books`, {
  //         name: `${userId}_lock`,
  //         metadata: 'User lock book',
  //         restrictions: {
  //           minBalance: 0,
  //         },
  //       })
  //       .pipe(
  //         catchError((error: AxiosError) => {
  //           console.error(error.response.data);
  //           throw new Error('Cannot create Lock Book');
  //         }),
  //       ),
  //   );

  //   const { data: short } = await firstValueFrom(
  //     this.httpService
  //       .post(`${this.baseUrl}/books`, {
  //         name: `${userId}_short`,
  //         metadata: 'User short book',
  //         restrictions: {
  //           minBalance: 0,
  //         },
  //       })
  //       .pipe(
  //         catchError((error: AxiosError) => {
  //           console.error(error.response.data);
  //           throw new Error('Cannot create Short Book');
  //         }),
  //       ),
  //   );

  //   return {
  //     mainBookId: main.data.book.id,
  //     lockBookId: lock.data.book.id,
  //     shortBookId: short.data.book.id,
  //   };
  // };

  /**
   * Get instrument balances for a Book
   * Instrument will be in uppercase
   * @param bookId
   * @param instruments
   * @returns
   */
  getBookBalances = async (
    bookId: string,
    instruments?: string[],
  ): Promise<Holdings | null> => {
    const allInstruments = !instruments || instruments.length === 0;
    if (!allInstruments) {
      instruments = instruments.map((i) => i.toUpperCase());
    }

    // const { data } = await firstValueFrom(
    //   this.httpService.get(`${this.baseUrl}/books/${bookId}/balance`).pipe(
    //     catchError((error: AxiosError) => {
    //       console.error(error);
    //       throw new Error('Cannot get book balances');
    //     }),
    //   ),
    // );
    //  Copying data from Output
    const balances ={};
    const res = {};

    if (!balances || Object.keys(balances).length === 0) {
      return null;
    }

    const modifiedBalances = instrumentsToUpper(balances);

    //  Mapping through the keys to fetch only the required balances
    Object.keys(modifiedBalances).forEach(function(instrument) {
      instrument = instrument.toUpperCase();
      if (allInstruments || instruments.includes(instrument)) {
        res[instrument] = modifiedBalances[instrument].balance;
      }
    });

    return res;
  };

  getBalances = async (bookId: string, instruments?: string[]) => {
    //  1. Get Balances from Ledger Service
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/books/${bookId}/balance`).pipe(
        catchError((error: AxiosError) => {
          console.error(error);
          throw new Error('Cannot get book balances');
        }),
      ),
    );

    //  2. Convert instruments to Uppercase
    let balances = data.data;
    if (!balances || Object.keys(balances).length === 0) {
      balances = {};
    }
    const modifiedBalances = instrumentsToUpper(balances);
    instruments = instruments.map((i) => i.toUpperCase());

    //  3. Filter balances for only required Instruments
    const finalBalance = {};

    const requiredInstruments =
      instruments && instruments.length > 0
        ? instruments
        : Object.keys(modifiedBalances);

    for (let i = 0; i < requiredInstruments.length; i += 1) {
      finalBalance[requiredInstruments[i]] =
        parseFloat(modifiedBalances[requiredInstruments[i]]?.balance) || 0;
    }

    return finalBalance;
  };

  lockFunds = async (
    books: Books,
    currency: Instrument,
    orderId: string,
    asset?: Instrument,
  ) => {
    const entries = [
      {
        bookId: books.mainBookId,
        assetId: currency.name,
        value: `-${currency.amount}`,
      },
      {
        bookId: books.lockBookId,
        assetId: currency.name,
        value: `${currency.amount}`,
      },
    ];

    if (asset && Number(asset.amount) > 0) {
      entries.push(
        {
          bookId: books.lockBookId,
          assetId: asset.name,
          value: `-${asset.amount}`,
        },
        {
          bookId: books.mainBookId,
          assetId: asset.name,
          value: `${asset.amount}`,
        },
      );
    }

    const input = {
      type: 'LOCK',
      memo: `${orderId}_lock`,
      entries,
      metadata: { operation: 'LOCK' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Cannot Lock User Funds');
        }),
      ),
    );

    return data.data;
  };

  undoUnlockFunds = async (
    orderId: string,
    userBooks: Books,
    currency: Instrument,
    asset?: Instrument,
  ) => {
    const entries = [
      {
        bookId: userBooks.lockBookId,
        assetId: currency.name,
        value: `${currency.amount}`,
      },
      {
        bookId: userBooks.mainBookId,
        assetId: currency.name,
        value: `-${currency.amount}`,
      },
    ];

    if (asset && Number(asset.amount) > 0) {
      entries.push(
        {
          bookId: userBooks.lockBookId,
          assetId: asset.name,
          value: `${asset.amount}`,
        },
        {
          bookId: userBooks.mainBookId,
          assetId: asset.name,
          value: `-${asset.amount}`,
        },
      );
    }

    const input = {
      type: 'TRANSFER',
      memo: `${orderId}_undo_unlock`,
      entries,
      metadata: { operation: 'UNDO_UNLOCK' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Cannot Undo Unlock Funds');
        }),
      ),
    );

    return data.data.operation;
  };

  unlockFunds = async (
    orderId: string,
    userBooks: Books,
    currency: Instrument,
    asset?: Instrument,
  ) => {
    const entries = [
      {
        bookId: userBooks.lockBookId,
        assetId: currency.name,
        value: `-${currency.amount}`,
      },
      {
        bookId: userBooks.mainBookId,
        assetId: currency.name,
        value: `${currency.amount}`,
      },
    ];

    if (asset && Number(asset.amount) > 0) {
      entries.push(
        {
          bookId: userBooks.lockBookId,
          assetId: asset.name,
          value: `-${asset.amount}`,
        },
        {
          bookId: userBooks.mainBookId,
          assetId: asset.name,
          value: `${asset.amount}`,
        },
      );
    }

    const input = {
      type: 'TRANSFER',
      memo: `${orderId}_unlock`,
      entries,
      metadata: { operation: 'UNLOCK' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Cannot Unlock Funds');
        }),
      ),
    );

    return data.data.operation;
  };

  //  Send Operations to the Ledger
  postOperation = async (memo: string, inputData) => {
    const entries = [];

    for (let i = 0; i < inputData.length; i++) {
      entries.push({
        bookId: inputData[i].from,
        assetId: inputData[i].instrument,
        value: `-${inputData[i].amount.toString()}`,
      });
      entries.push({
        bookId: inputData[i].to,
        assetId: inputData[i].instrument,
        value: inputData[i].amount.toString(),
      });
    }

    const input = {
      type: 'TRANSFER',
      memo,
      entries,
      metadata: { operation: 'DEPOSIT' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Cannot Post Operation');
        }),
      ),
    );

    return data;
  };

  undoTrade = async (
    buyer: Books,
    seller: Books,
    exchange: Exchange,
    fees: Fees,
    memo: string,
  ) => {
    const entries = [
      //  1. Transfer Assets from Buyer to Seller
      {
        bookId: seller.lockBookId,
        assetId: exchange.asset,
        value: `${exchange.quantity}`,
      },
      {
        bookId: buyer.mainBookId,
        assetId: exchange.asset,
        value: `-${exchange.quantity}`,
      },
      //  2. Transfer Currency from Seller to Buyer
      {
        bookId: buyer.lockBookId,
        assetId: exchange.currency,
        value: `${exchange.price}`,
      },
      {
        bookId: seller.mainBookId,
        assetId: exchange.currency,
        value: `-${exchange.price}`,
      },
    ];

    //  3. Refund Buyer and Seller Fees if applicable
    if (fees.buyer && Number(fees.buyer) > 0) {
      entries.push({
        bookId: buyer.lockBookId,
        assetId: exchange.currency,
        value: `${fees.buyer}`,
      });
      entries.push({
        bookId: SHBOOKS.FEES,
        assetId: exchange.currency,
        value: `-${fees.buyer}`,
      });
    }

    if (fees.seller && Number(fees.seller) > 0) {
      entries.push({
        bookId: seller.lockBookId,
        assetId: exchange.currency,
        value: `${fees.seller}`,
      });
      entries.push({
        bookId: SHBOOKS.FEES,
        assetId: exchange.currency,
        value: `-${fees.seller}`,
      });
    }

    const input = {
      type: 'TRANSFER',
      memo,
      entries,
      metadata: { operation: 'UNDO' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Ledger: Unable to undo Trade');
        }),
      ),
    );

    return data.data.operation;
  };

  makeTrade = async (
    buyer: Books,
    seller: Books,
    exchange: Exchange,
    fees: Fees,
    memo: string,
  ) => {
    const entries = [
      //  1. Transfer Assets from Seller to Buyer
      {
        bookId: seller.lockBookId,
        assetId: exchange.asset,
        value: `-${exchange.quantity}`,
      },
      {
        bookId: buyer.mainBookId,
        assetId: exchange.asset,
        value: `${exchange.quantity}`,
      },
      //  2. Transfer Currency from Buyer to Seller
      {
        bookId: buyer.lockBookId,
        assetId: exchange.currency,
        value: `-${exchange.price}`,
      },
      {
        bookId: seller.mainBookId,
        assetId: exchange.currency,
        value: `${exchange.price}`,
      },
    ];

    //  3. Add Buyer and Seller Fees if applicable
    if (fees.buyer && Number(fees.buyer) > 0) {
      entries.push({
        bookId: buyer.lockBookId,
        assetId: exchange.currency,
        value: `-${fees.buyer}`,
      });
      entries.push({
        bookId: SHBOOKS.FEES,
        assetId: exchange.currency,
        value: `${fees.buyer}`,
      });
    }

    if (fees.seller && Number(fees.seller) > 0) {
      entries.push({
        bookId: seller.lockBookId,
        assetId: exchange.currency,
        value: `-${fees.seller}`,
      });
      entries.push({
        bookId: SHBOOKS.FEES,
        assetId: exchange.currency,
        value: `${fees.seller}`,
      });
    }

    const input = {
      type: 'TRANSFER',
      memo,
      entries,
      metadata: { operation: 'TRADE' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Ledger: Unable to Trade');
        }),
      ),
    );

    return data.data.operation;
  };

  create = async (asset: Instrument, bookId: string) => {
    const entries = [
      {
        bookId: SHBOOKS.CASH,
        assetId: asset.name,
        value: `-${asset.amount}`,
      },
      {
        bookId,
        assetId: asset.name,
        value: `${asset.amount}`,
      },
    ];

    const input = {
      type: 'MINT',
      memo: `MINT_${asset.name}_${asset.amount}_${new Date().getTime()}`,
      entries,
      metadata: { operation: 'MINT', asset },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error(`Could not Mint Asset: ${error.cause}`);
        }),
      ),
    );

    return data.data.operation;
  };

  depositFunds = async (receiver: Books, asset: Instrument) => {
    const totalAmount = parseFloat(parseFloat(asset.amount).toFixed(2));
    const tax = parseFloat(((22 / 100) * totalAmount).toFixed(2));
    const userDeposit = totalAmount - tax;

    const entries = [
      //  1. Transfer tax to SH TCS book from Cash book
      {
        bookId: SHBOOKS.CASH,
        assetId: asset.name,
        value: `-${tax}`,
      },
      {
        bookId: SHBOOKS.TCS,
        assetId: asset.name,
        value: tax.toString(),
      },
      //  2. Transfer remaining amount to User
      {
        bookId: SHBOOKS.CASH,
        assetId: asset.name,
        value: `-${userDeposit}`,
      },
      {
        bookId: receiver.mainBookId.toString(),
        assetId: asset.name,
        value: userDeposit.toString(),
      },
    ];

    const input = {
      type: 'TRANSFER',
      memo: `DEPOSIT_${receiver.mainBookId}_${new Date().getTime()}`,
      entries,
      metadata: { operation: 'DEPOSIT', amount: asset.amount },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Could not Deposit Funds');
        }),
      ),
    );

    return {
      ...data.data.operation,
      tax,
      userDeposit,
    };
  };

  addRewards = async (receiver: Books, asset: Instrument) => {
    //  1. Transfer rewards from Cash Book to User
    const entries = [
      {
        bookId: SHBOOKS.CASH,
        assetId: asset.name,
        value: `-${asset.amount}`,
      },
      {
        bookId: receiver.mainBookId,
        assetId: asset.name,
        value: `${asset.amount}`,
      },
    ];

    const input = {
      type: 'TRANSFER',
      memo: `REWARD_${receiver.mainBookId}_${new Date().getTime()}`,
      entries,
      metadata: { operation: 'REWARD' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Could not Transfer Rewards');
        }),
      ),
    );

    return data.data.operation;
  };

  //  TODO: Remove this in favor of addRewards
  transferRewards = async (
    receiverBookId: string,
    instrument: string,
    receiverAmount: number,
  ) => {
    const transferFrom: Books = {
      mainBookId: '1',
      lockBookId: '2',
    };

    const asset = {
      name: instrument.toUpperCase(),
      amount: receiverAmount,
    };

    //  1. Transfer rewards from Seller to Buyer
    const entries = [
      {
        bookId: transferFrom.mainBookId,
        assetId: asset.name,
        value: `-${asset.amount.toString()}`,
      },
      {
        bookId: receiverBookId,
        assetId: asset.name,
        value: asset.amount.toString(),
      },
    ];

    const input = {
      type: 'TRANSFER',
      memo: 'REWARDS',
      entries,
      metadata: { operation: 'SWAP' },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Cannot Post Operation');
        }),
      ),
    );

    return data;
  };

  mint = async (asset: Instrument, currency: Instrument) => {
    //  Transfer Cash from SH Main to Cash Book
    const entries = [
      {
        bookId: SHBOOKS.MAIN,
        assetId: currency.name,
        value: `-${currency.amount}`,
      },
      {
        bookId: SHBOOKS.CASH,
        assetId: currency.name,
        value: `${currency.amount}`,
      },

      //  Transfer Stocks from Cash Book to SH Main
      {
        bookId: SHBOOKS.CASH,
        assetId: asset.name,
        value: `-${asset.amount}`,
      },
      {
        bookId: SHBOOKS.MAIN,
        assetId: asset.name,
        value: `${asset.amount}`,
      },
    ];

    const input = {
      type: 'TRANSFER',
      memo: `MINT_${asset.name}_${asset.amount}_${new Date().getTime()}`,
      entries,
      metadata: { operation: 'MINT', asset, currency },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, input).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new Error('Could not Mint Assets');
        }),
      ),
    );

    console.log(data);
    return data.data.operation;
  };
}
