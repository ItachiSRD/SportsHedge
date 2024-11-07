import { View, ViewProps } from 'react-native';
import Button from '@/components/general/buttons/Button';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { colors } from '@/styles/theme/colors';

interface IEditProfileHeaderProps extends ViewProps {
    onGoBack?: () => void;
}

const EditProfileHeader = ({ onGoBack, ...props }: IEditProfileHeaderProps) => {
  return (
    <View {...props}>
      <Button
        onPress={onGoBack}
        style={{ gap: 12 }}
        variant="ghost"
        containerClass="justify-start"
        textClass="text-theme-content-active"
        title="Back"
        leadingIcon={<ChevronRightIcon width={24} height={24} fill={colors['brand-content']} className="rotate-180" />}
      />
    </View>
  );
};

export default EditProfileHeader;