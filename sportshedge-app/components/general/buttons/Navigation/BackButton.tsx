import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import Button from '@/components/general/buttons/Button';
import { colors } from '@/styles/theme/colors';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface IBackButton extends ViewProps {
  onGoBack?: () => void;
  title?: string;
}

const BackButton = ({ onGoBack, title = 'Back', ...props }: IBackButton) => {
  return (
    <View {...props}>
      <Button
        onPress={onGoBack}
        style={{ gap: 12 }}
        variant="ghost"
        containerClass="justify-start"
        textClass="text-[14px] leading-[21px] tracking-[0.64px] text-theme-content-active"
        title={title}
        leadingIcon={<ChevronLeftIcon width={18} height={18} fill={colors['brand-content']} className="mt-[1.5px]" />}
      />
    </View>
  );
};

export default BackButton;
