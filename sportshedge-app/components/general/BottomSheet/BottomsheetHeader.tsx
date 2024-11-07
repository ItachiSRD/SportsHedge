import { View } from 'react-native';
import CustomText from '../Text';
import PressableBtn from '../buttons/PressableBtn';
import CrossIcon from '@/assets/icons/X.svg';
import { colors } from '@/styles/theme/colors';

interface IBottomSheetHeaderProps {
    title?: string;
    handleClose?: () => void;
}

const BottomsheetHeader = ({ title, handleClose }: IBottomSheetHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between pt-[22px] pb-[21px] border-b border-global-gray-80 px-[30px]">
      <CustomText textClass="text-brand-content leading-[21px] tracking-[0.56px]">
        {title || ''}
      </CustomText>
      <PressableBtn onPress={handleClose}>
        <CrossIcon width={20} height={20} fill={colors['brand-content']} />
      </PressableBtn>
    </View>
  );
};

export default BottomsheetHeader;