import { View } from 'react-native';
import React from 'react';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import CustomText from '@/components/general/Text';
import BriefCaseIcon from '@/assets/icons/briefcase-blank.svg';
import PlayerRoleText from './PlayerRoleText';
import { COUNTRY_FLAGS } from '@/constants/country-flags';
import { colors } from '@/styles/theme/colors';
import { IPlayerBasicInfo, PlayerPriceT } from '@/types/entities/player';
import { noOfGameListKeys } from '@/constants/players';
import { roundOffNumber } from '@/utils/number';

interface IFavoritePlayerCardProps extends IPressableBtnProps {
  player: IPlayerBasicInfo;
  playerPrice?: PlayerPriceT;
  quantity?: number;
  selectedNoOfGame?: keyof typeof noOfGameListKeys;
}

const FavoritePlayerCard = ({
  player,
  quantity=2,
  playerPrice,
  selectedNoOfGame = 1,
  ...props
}: IFavoritePlayerCardProps) => {
  console.log(player.team);
  const CountryFlag = COUNTRY_FLAGS[player.team];
 

  let playerCurrentPrice: number| null = null;
  let percentageChange: number| null = null;
  if (playerPrice) {
    playerCurrentPrice = playerPrice.price;
    percentageChange = roundOffNumber(
      ((playerCurrentPrice - playerPrice[noOfGameListKeys[selectedNoOfGame]]) /
        playerCurrentPrice) *
        100
    );
  }

  return (
    
    <PressableBtn
      {...props}
      key={player.id}
      style={{ gap: 6 }}
      pressableClasses="py-4 border-b border-theme-primary">
      <View className="flex-row justify-between items-center">
        <CustomText
          fontWeight={500}
          textClass="text-brand-content leading-[21px] tracking-[0.56px]">
          {player.name}
        </CustomText>
        {playerCurrentPrice ? (
          <CustomText
            fontWeight={500}
            textClass="text-brand-content leading-[21px] tracking-[0.56px]">
            ₹ {playerCurrentPrice || ''}
          </CustomText>
        ) : null}
      </View>
      <View className="flex-row justify-between items-center">
        <View style={{ gap: 16 }} className="flex-row items-center">
          <CountryFlag />
          {quantity ? (
            <>
              <View style={{ gap: 4 }} className="flex-row items-center">
                <BriefCaseIcon fill={colors['theme-content-active']} />
                <CustomText textClass="text-theme-content-active text-xs leading-[18px] tracking-[0.48px]">
                  {quantity}
                </CustomText>
              </View>
              <CustomText textClass="text-global-gray-50">|</CustomText>
            </>
          ) : null}
          <PlayerRoleText role={player.role} />
        </View>
        {percentageChange ? (
          <CustomText
            textClass={`text-xs leading-[18px] tracking-[0.48px] ${
              percentageChange < 0 ? 'text-global-red-50' : 'text-global-green-50'
            }`}>
            {percentageChange < 0 ? '-' : '+'}
            {Math.abs(percentageChange)}%
          </CustomText>
        ) : null}
      </View>
    </PressableBtn>
  );
};

export default FavoritePlayerCard;
