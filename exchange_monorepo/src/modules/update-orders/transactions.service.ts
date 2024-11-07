import { Injectable } from '@nestjs/common';
import { MEError, MEOrder, Match } from './types';
import { Order } from '../../entities/orders.entity';
import { User } from '../users/entity/users.entity';

@Injectable()
export class TransactionService {
  getConvertedOrderIds = (
    orderId: string,
    fulfilled: MEOrder | MEError,
    partial?: MEOrder,
  ): bigint[] => {
    const orderIds: Set<bigint> = new Set<bigint>();
    orderIds.add(BigInt(orderId));

    for (const orderId in fulfilled) {
      orderIds.add(BigInt(orderId));
    }

    if (partial) orderIds.add(BigInt(Object.keys(partial)[0]));

    return [...orderIds];
  };

  getConvertedUserIds = (orders: Order[]): string[] => {
    const userIds: string[] = [];
    for (let i = 0; i < orders.length; i++) {
      userIds.push(orders[i].userId.toString());
    }

    return userIds;
  };

  convertToTransaction = (
    orderDetails: Order[],
    userDetails: User[],
    orderList: MEOrder | MEError,
  ): Match[] => {
    const allOrders: Match[] = [];

    //  1. Convert User array to Map for faster lookup
    const usersMap = userDetails.reduce((map, user) => {
      map[user.id] = user.dataValues;
      return map;
    }, {});

    //  2. Loop through Order Details to create Objects
    for (let i = 0; i < orderDetails.length; i++) {
      const orderId: string = orderDetails[i].orderId.toString();
      const isFulfilled = orderList[orderId] != undefined;
      const meOrder = isFulfilled ? orderList?.[orderId] : {};

      const transaction: Match = {
        orderId,
        ...meOrder,
        isFulfilled,
        order: orderDetails[i],
        user: {
          id: usersMap[orderDetails[i].userId.toString()].id,
          books: {
            mainBookId: usersMap[orderDetails[i].userId.toString()].mainBookId,
            lockBookId: usersMap[orderDetails[i].userId.toString()].lockBookId,
          },
          currency: usersMap[orderDetails[i].userId.toString()].currency,
        },
      };

      //  TODO: Use Bignumber
      //  Note: Divide by 2 digit Precision
      if (transaction.p)
        transaction.p = (parseFloat(transaction.p) / 100).toFixed(2);
      allOrders.push(transaction);
    }

    return allOrders;
  };

  formatToTransaction = (
    uniqueOrderId: string,
    fulfilled: MEOrder,
    partial: MEOrder,
    orderDetails: Order[],
    userDetails: User[],
  ): { unique: Match; allOrders: Match[] } => {
    let unique: Match;
    const allOrders: Match[] = [];

    //  1. Convert User array to Map for faster lookup
    const usersMap = userDetails.reduce((map, user) => {
      map[user.id] = user.dataValues;
      return map;
    }, {});

    //  2. Loop through Order Details to create Objects
    for (let i = 0; i < orderDetails.length; i++) {
      const orderId: string = orderDetails[i].orderId.toString();
      const isFulfilled = fulfilled && orderId in fulfilled;

      const meOrder = isFulfilled
        ? fulfilled?.[orderId]
        : partial?.[orderId] || {};

      const currentObject: Match = {
        orderId,
        ...meOrder,
        isFulfilled,
        order: orderDetails[i],
        user: {
          id: usersMap[orderDetails[i].userId.toString()].id,
          books: {
            mainBookId: usersMap[orderDetails[i].userId.toString()].mainBookId,
            lockBookId: usersMap[orderDetails[i].userId.toString()].lockBookId,
          },
          currency: usersMap[orderDetails[i].userId.toString()].currency,
        },
      };

      //  TODO: Use Bignumber
      //  Note: Divide by 2 digit Precision
      if (currentObject.p)
        currentObject.p = (parseFloat(currentObject.p) / 100).toFixed(2);

      if (orderId === uniqueOrderId) {
        unique = currentObject;
      } else {
        allOrders.push(currentObject);
      }
    }

    return { unique, allOrders };
  };
}
