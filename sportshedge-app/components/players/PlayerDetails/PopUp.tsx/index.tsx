import CustomText from "@/components/general/Text";
import PressableBtn from "@/components/general/buttons/PressableBtn";
import { useState } from "react";
import { View } from "react-native";

import Modal from 'react-native-modal';
import XMark from '@/assets/icons/X.svg';
import { colors } from "@/styles/theme/colors";
import BorderBumpDownIcon from '@/assets/icons/border-bump-down.svg';

interface IPopUpProps {
  desc?: string;
  onClose: () => void;
}

const PopUp = ({ desc, onClose} : IPopUpProps) => {

  const [isModalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    onClose();
  };

  return (
    <Modal isVisible={isModalVisible} backdropOpacity={0.5}>
      <View className="rounded-[10px] bg-brand-content">
        <PressableBtn onPress={toggleModal}>
          <View className="bg-global-gray-20 rounded-[22px] absolute p-2 top-[-15] right-[-15]">
            <XMark width={16} height={16} fill={colors['theme-secondary']}/>
          </View>
        </PressableBtn>
        <CustomText fontWeight={700} className="text-theme-secondary text-[14px] leading-[21px] tracking-[0.46px] m-4">{desc}</CustomText>
      </View>
    </Modal>
  )
}

export default PopUp;