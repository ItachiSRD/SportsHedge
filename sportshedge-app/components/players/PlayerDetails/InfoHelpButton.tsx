import CustomText from "@/components/general/Text";
import PressableBtn from "@/components/general/buttons/PressableBtn";
import { View } from "react-native";
import ChvronRightIcon from '@/assets/icons/chevron-right.svg';
import { colors } from "@/styles/theme/colors";

interface IInfoHelpButtonProps {
  onPress?: () => void;
  text?: string;
}

const InfoHelpButton = ( {onPress, text}: IInfoHelpButtonProps) => {
  return (
    <PressableBtn onPress={onPress} className="flex-1">
      <View className="flex-row px-4 py-2 rounded-[24px] bg-[#404047] justify-between items-center">
        <CustomText className="text-theme-content-primary text-[14px] leading-[21px] tracking-[0.56px]">{text}</CustomText>
        <ChvronRightIcon fill={colors['global-gray-50']} width={20} height={20} />
      </View>
      
    </PressableBtn>
  )
}

export default InfoHelpButton;