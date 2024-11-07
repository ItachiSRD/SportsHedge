import { View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '@/components/general/Text';
import PlayerBasicDetails from '../PlayerDetails/PlayerBasicDetails';
import { PlayerRolesT } from '@/types/entities/player';

interface IPlaceOrderPlayerInfo {
  name: string;
  countryCode: string;
  playerRole: PlayerRolesT;
  quantity?: number;
  price: number;
}

const PlaceOrderPlayerInfo = ({
  name,
  countryCode,
  playerRole,
  quantity,
  price
}: IPlaceOrderPlayerInfo) => {
  return (
    <LinearGradient
      colors={['#3D3D40', '#29292E', 'rgba(36, 36, 36, 0.51)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5914, 1.1832]}
      style={{ borderRadius: 20 }}>
      <View className="py-6 rounded-[20px] justify-between">
        <View className="px-[30px] items-center">
          <CustomText
            fontWeight={700}
            textClass="text-brand-content text-2xl leading-[36px] mb-5 text-center">
            {name}
          </CustomText>
          <PlayerBasicDetails
            playerRole={playerRole}
            quantity={quantity}
            countryCode={countryCode}
          />
        </View>
        <View className="w-full h-[1px] mt-7 mb-5 bg-outline-secondary" />
        <View className="flex-row items-center justify-between px-[30px]">
          <CustomText textClass="text-brand-content">Current Price</CustomText>
          <CustomText fontWeight={700} className="text-brand-content text-xl leading-[30px] tracking-[0.8px]">
            ₹ {price}
          </CustomText>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PlaceOrderPlayerInfo;
