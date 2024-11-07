import { View, ViewProps } from 'react-native';
import React from 'react';
import CircleTickIcon from '@/assets/icons/CircleTickGreen.svg';
import CustomText from '@/components/general/Text';

interface IVerifiedCredentialProps extends ViewProps {
  text: string;
}

const VerifiedCredential = ({ text, style, ...props }: IVerifiedCredentialProps) => {
  return (
    <View {...props} style={[{ gap: 8 }, style]} className="flex-row py-[5px]">
      <CircleTickIcon />
      <CustomText fontWeight={500} textClass="leading-[21px] tracking-[0.56px] text-brand-content">
        {text}
      </CustomText>
    </View>
  );
};

export default VerifiedCredential;
