import CustomText from '@/components/general/Text'
import { View } from 'react-native';

import BatIcon from '@/assets/icons/bat-icon.svg';

interface ITradeCardProps {
  transactionType: 'buy' | 'sell';
  country1?: string;
  country2?: string;
  player?: string;
  price?: string;
}

const TextHeader = ({ text, textStyles }: { text: string, textStyles: string }) => {
  return (
    <CustomText fontWeight={500} className={`${textStyles} text-[14px] leading-[21px] tracking-[0.56px]`}>
      {text}
    </CustomText>
  );
};


const TradeCard = ( {transactionType , country1, country2, player, price}: ITradeCardProps) => {
  return (
    <View className='bg-global-gray-80 rounded-[18px]'>
      <View className='my-[12.5px] mx-[13.5] items-center '>
        <View style={{ gap: 18 }} className='flex-row items-center '>
          <BatIcon width={24} height={24} />
          <View className='flex-row justify-between'>
            <TextHeader text={`${country1}`} textStyles='text-brand-content' />
            <TextHeader text='vs' textStyles='text-global-gray-50 mx-[10px]' />
            <TextHeader text={`${country2}`} textStyles='text-brand-content' />
          </View>
        </View>
        <View className='h-[1px] bg-[#565661] w-full my-[13.5px]' />
        <View style={{gap: 8}} className='flex-row items-center'>
        <CustomText
              fontWeight={500}
              textClass={`py-[1px] px-[7px] rounded leading-[21px] tracking-[0.56px] uppercase ${
                transactionType === 'buy'
                  ? 'bg-global-green-90 text-global-green-30'
                  : 'bg-global-red-80 text-global-red-20'
              }`}>
              {transactionType}
            </CustomText>
          <View style={{justifyContent: 'space-between'}} className='flex-row flex-1'>
            <TextHeader text={`${player}`} textStyles='text-brand-content' />
            <TextHeader text={`${price}`} textStyles='text-theme-content-primary' />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TradeCard;