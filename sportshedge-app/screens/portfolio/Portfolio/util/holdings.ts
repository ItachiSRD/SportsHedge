import { SORT_HOLDING_OPTIONS } from '@/constants/portfolio';

// TODO: Fix all the types while integration

export const sortHoldings = (holdings: any[], sortBy: string) => {
  if (sortBy === SORT_HOLDING_OPTIONS[0])
    return holdings.sort((a, b) => a.playerName.localeCompare(b.playerName));

  if (sortBy === SORT_HOLDING_OPTIONS[1])
    return holdings.sort((a, b) => b.ltpPercentageChange - a.ltpPercentageChange);

  if (sortBy === SORT_HOLDING_OPTIONS[2]) return holdings.sort((a, b) => b.ltp - a.ltp);

  if (sortBy === SORT_HOLDING_OPTIONS[3])
    return holdings.sort((a, b) => {
      const profitLossA = (a.currentPrice - a.investedAmount) / a.investedAmount;
      const profitLossB = (b.currentPrice - b.investedAmount) / b.investedAmount;

      return profitLossB - profitLossA;
    });

  if (sortBy === SORT_HOLDING_OPTIONS[4])
    return holdings.sort((a, b) => b.investedAmount - a.investedAmount);
};
