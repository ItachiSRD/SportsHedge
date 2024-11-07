import CustomText from "@/components/general/Text";
import { View } from "react-native";

interface IButtonOverlayProps {
  text: string;
}

const ButtonOverlay = ({ text }: IButtonOverlayProps) => {
  return (
    <View className="flex-1 px-[9.41px] py-[10.19px] border border-outline-secondary rounded-[7.84px] items-center">
      <CustomText fontWeight={700} className="text-[12.543px] text-white leading-[18.815px] tracking-[0.502px]">{text}</CustomText>
    </View>
  )
}

export default ButtonOverlay;