import { TransactionSideT } from '@/types/entities/order';

export const validateOrderPlacement = (
  side: TransactionSideT,
  availableBalance: number,
  orderAmount: number,
) => {
  if (side === 'buy' && orderAmount > availableBalance) return false;
  return true;
};
