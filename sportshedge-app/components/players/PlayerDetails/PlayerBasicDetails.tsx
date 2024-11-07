import { View } from 'react-native';
import React from 'react';
import { COUNTRY_FLAGS } from '@/constants/country-flags';
import BriefCaseIcon from '@/assets/icons/briefcase-blank.svg';
import { colors } from '@/styles/theme/colors';
import CustomText from '@/components/general/Text';
import PlayerRoleText from '@/components/home/HomeScreen/PlayerRoleText';
import { PlayerRolesT } from '@/types/entities/player';

interface IPlayerBasicDetailsProps {
    countryCode: string;
    quantity?: number;
    playerRole: PlayerRolesT;
}

const PlayerBasicDetails = ({ countryCode, quantity, playerRole }: IPlayerBasicDetailsProps) => {
  const CountryFlag = COUNTRY_FLAGS[countryCode];

  return (
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
      <PlayerRoleText role={playerRole} />
    </View>
  );
};

export default PlayerBasicDetails;