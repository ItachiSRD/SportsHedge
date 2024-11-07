import { View } from 'react-native';
import PressableBtn, { IPressableBtnProps } from '@/components/general/buttons/PressableBtn';
import CustomText from '@/components/general/Text';

interface IProfileMenuCardProps extends IPressableBtnProps {
    icon: React.ReactNode;
    title: string;
    desc?: string;
    onPress?: () => void;
}

const ProfileMenuCard = ({ icon, title, desc, onPress}: IProfileMenuCardProps) => {
  return (
    <PressableBtn style={{ gap: 16 }} pressableClasses="flex-1 p-5 rounded-[20px] border border-global-gray-80 justify-between" onPress={onPress}>
      <View>
        {icon}
        <CustomText textClass="mt-6 text-[16px] text-brand-content leading-[24px] tracking-[0.64px]">{title}</CustomText>
      </View>
      <CustomText textClass="text-theme-content-secondary text-[10px] leading-[15px] tracking-[0.4px]">{desc}</CustomText>
    </PressableBtn>
  );
};

export default ProfileMenuCard;