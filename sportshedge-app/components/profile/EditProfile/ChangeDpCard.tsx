import { View, Image, ViewProps, ImageSourcePropType } from 'react-native';
import Avataricon from '@/assets/icons/avatar.svg';
import Button from '@/components/general/buttons/Button';

interface IChangeDpCardProps extends ViewProps {
  profileImgSrc?: ImageSourcePropType;
  onChangePress?: () => void;
}

const ChangeDpCard = ({ profileImgSrc, onChangePress, style, ...props }: IChangeDpCardProps) => {
  return (
    <View {...props} style={[{ gap: 21 }, style]} className="flex-row py-[5px] items-center">
      {profileImgSrc ? <Image source={profileImgSrc} /> : <Avataricon />}
      <Button
        onPress={onChangePress}
        variant="ghost"
        title="Change"
        textClass="text-brand-content"
      />
    </View>
  );
};

export default ChangeDpCard;
