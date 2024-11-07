import { View } from 'react-native';
import { useState } from 'react';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import Button from '@/components/general/buttons/Button';
import { isValidNumber } from '@/utils/inputvalidators';

interface IStockQuantityAndPriceProps {
  stockQty: number;
  handleStockQty: (qty: number) => void;
  stockPrice: number;
  handlePriceChange: (price: number) => void;
  canChangePrice?: boolean;
  handleIncrementStockQty?: () => void;
  handleDecrementStockQty?: () => void;
}

const StockQuantityAndPrice = ({
  stockQty,
  handleStockQty,
  stockPrice,
  handlePriceChange,
  handleIncrementStockQty,
  handleDecrementStockQty,
  canChangePrice = true
}: IStockQuantityAndPriceProps) => {
  const [stockQtyText, setStockQtyText] = useState('');
  const [stockPriceText, setStockPriceText] = useState('');

  const handleStockQtyChange = (qty: string) => {
    if (isValidNumber(qty)) {
      setStockQtyText(qty);
      handleStockQty(parseFloat(qty));
    } else {
      setStockQtyText('');
      handleStockQty(0);
    }
  };

  const handleStockPriceChange = (price: string) => {
    if (isValidNumber(price)) {
      setStockPriceText(price);
      handlePriceChange(parseFloat(price));
    } else {
      setStockPriceText('');
      handlePriceChange(0);
    }
  };

  const priceTextColor = canChangePrice ? 'text-theme-content-primary' : 'text-global-gray-50';

  return (
    <View style={{ gap: 16 }} className="flex-row items-center">
      <View style={{gap: 4}} className={`${canChangePrice ? 'flex-1' : 'w-2/3'}`}>
        <Label
          labelTitleProps={{ className: 'text-theme-content-primary', fontWeight: 400 }}
          title="No. of Stocks"
        />
        <View style={{ gap: 1 }} className="flex-row flex-1 rounded-[10px] overflow-hidden">
          <TextInput
            rootContainerClass="flex-1"
            containerProps={{
              className: 'py-3'
            }}
            keyboardType="number-pad"
            textClass="text-theme-content-primary"
            value={ stockQty ? `${stockQty}` : stockQtyText}
            onChangeText={handleStockQtyChange}
          />
          <Button
            onPress={handleDecrementStockQty}
            containerClass="w-[50px] bg-theme-primary"
            textClass="text-brand-content text-lg"
            title="-"
          />
          <Button
            onPress={handleIncrementStockQty}
            containerClass="w-[50px] bg-theme-primary"
            textClass="text-brand-content text-lg"
            title="+"
          />
        </View>
      </View>
      {canChangePrice && (
        <View>
          <Label labelTitleProps={{ className: priceTextColor, fontWeight: 400 }} title="Stock Price" />
          <TextInput
            shape="rounded"
            containerProps={{
              className: 'py-3 w-[98px]'
            }}
            value={stockPrice ? `${stockPrice}` : stockPriceText}
            onChangeText={handleStockPriceChange}
            editable={canChangePrice}
            keyboardType="number-pad"
            textClass={priceTextColor}
          />
        </View>
      )}
    </View>
  );
};

export default StockQuantityAndPrice;
