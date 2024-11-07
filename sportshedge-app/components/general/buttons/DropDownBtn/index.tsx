import PressableBtn, { IPressableBtnProps } from '../PressableBtn';
import CustomText, { ICustomTextProps } from '../../Text';
import ChevronUpDownIcon from '@/assets/icons/chevron-up-down.svg';
import { SvgProps } from 'react-native-svg';
import { dropDownBtnStyles } from './styles';

interface IDropDownBtnProps extends IPressableBtnProps {
  title?: string;
  iconProps?: SvgProps;
  textProps?: ICustomTextProps
}

const DropDownBtn = ({ title, iconProps, style, textProps, ...props }: IDropDownBtnProps) => {
  const pressableStyles =
    typeof style === 'object'
      ? { ...dropDownBtnStyles.pressable, ...style }
      : dropDownBtnStyles.pressable;
  return (
    <PressableBtn {...props} style={pressableStyles} pressableClasses="flex-row items-center">
      <CustomText {...textProps}>{title}</CustomText>
      <ChevronUpDownIcon {...iconProps} />
    </PressableBtn>
  );
};

export default DropDownBtn;
