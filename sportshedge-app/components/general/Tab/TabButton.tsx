import BorderBumpIcon from '@/assets/icons/border-bump.svg';
import BriefcaseIcon from '@/assets/icons/briefcase-blank-20.svg';
import BriefcaseIconSolid from '@/assets/icons/briefcase-blank-solid.svg';
import BullishIconSolid from '@/assets/icons/bullish-solid.svg';
import BullishIcon from '@/assets/icons/bullish.svg';
import HomeIconOutlined from '@/assets/icons/house-chimney-outlined.svg';
import HomeIconSolid from '@/assets/icons/house-chimney-solid.svg';
import ProfileIconSolid from '@/assets/icons/user-xmark-solid.svg';
import ProfileIcon from '@/assets/icons/user-xmark.svg';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import CustomText from '../Text';
import PressableBtn from '../buttons/PressableBtn';

interface ITabButtonProps extends BottomTabBarButtonProps {
  title?: string;
  tabName: 'home' | 'players' | 'portfolio' | 'profile';
}

const icons = {
  focused: {
    home: HomeIconSolid,
    players: BullishIconSolid,
    portfolio: BriefcaseIconSolid,
    profile: ProfileIconSolid
  },
  nonfocused: {
    home: HomeIconOutlined,
    players: BullishIcon,
    portfolio: BriefcaseIcon,
    profile: ProfileIcon
  }
};

const TabButton = ({ title, tabName, onPress, accessibilityState }: ITabButtonProps) => {
  const focused = accessibilityState?.selected;

  const Icon = focused ? icons.focused[tabName] : icons.nonfocused[tabName];
  return (
    <PressableBtn
      onPress={onPress}
      pressableClasses="flex-1 justify-center items-center relative pt-[18px] pb-[22px]">
      <Icon width={20} height={20} />
      <CustomText
        fontWeight={focused ? 500 : 400}
        textClass={`text-xs ${
          focused ? 'text-brand-content' : 'text-theme-content-secondary'
        } mt-1.5`}>
        {title}
      </CustomText>
      {focused ? <BorderBumpIcon className="absolute -top-[12.16px]" /> : null}
    </PressableBtn>
  );
};

export default TabButton;
