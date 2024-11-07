import { View, ViewProps } from 'react-native';
import React from 'react';
import HeaderText from './HeaderText';
import TableRowText from './TableRowText';


interface IPlayerMarketDepthTable extends ViewProps {
    bids: number[][];
    offers: number[][];
}

const PlayerMarketDepthTable = ({ bids, offers }: IPlayerMarketDepthTable) => {
  return (
    <View style={{ gap: 20 }} className="flex-row justify-between">
      <View style={{ gap: 10 }} className="flex-1 max-w-[130px] justify-between">
        <View className="flex-row items-center justify-between mb-1.5">
          <HeaderText>Bid</HeaderText>
          <HeaderText textClass="text-right">Qty</HeaderText>
        </View>
        {bids.map((bid, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <TableRowText>{bid[0]}</TableRowText>
            <TableRowText textClass="text-right">{bid[1]}</TableRowText>
          </View>
        ))}
      </View>
      <View style={{ gap: 10 }} className="flex-1 max-w-[130px] justify-between">
        <View className="flex-row items-center justify-between mb-1.5">
          <HeaderText>Offer</HeaderText>
          <HeaderText textClass="text-right">Qty</HeaderText>
        </View>
        {offers.map((offer, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <TableRowText type="sell">{offer[0]}</TableRowText>
            <TableRowText type="sell" textClass="text-right">{offer[1]}</TableRowText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PlayerMarketDepthTable;