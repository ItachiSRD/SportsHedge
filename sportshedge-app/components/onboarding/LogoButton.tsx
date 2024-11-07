import { View } from "react-native";
import PressableBtn from "../general/buttons/PressableBtn";

interface ILogoButtonProps {
  providerIcon?: React.ReactNode;
  onPress?: () => void;
  customStyles?: string;
}

const LogoButton = ({ providerIcon, onPress , customStyles }: ILogoButtonProps) => {
  return (
    <PressableBtn onPress={onPress}>
      <View className={`rounded-[16px] p-[15px] border border-global-gray-80 bg-global-gray-70 ${customStyles}`}>
        {providerIcon}
      </View>
    </PressableBtn>
  )
}

export default LogoButton;