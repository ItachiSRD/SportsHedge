import PressableBtn, { IPressableBtnProps } from "@/components/general/buttons/PressableBtn";
import { View } from "react-native";
import CustomText from "@/components/general/Text";
import { colors } from "@/styles/theme/colors";
import Button from "@/components/general/buttons/Button";

interface IModalButtonProps extends IPressableBtnProps{
  icon: React.ReactNode;
  customStyles?: string;
  onPress?: () => void;
}

const ModalButton = ({ icon , onPress , customStyles }: IModalButtonProps) => {
  return (
    <PressableBtn onPress={onPress}>
      <View className={`rounded-[20px] border border-[#E4E4ED] px-[12px] py-[4px] ${customStyles}`}>
        {icon}
      </View>
    </PressableBtn>
  );
};

export default ModalButton;