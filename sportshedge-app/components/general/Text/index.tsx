import { FONTS, FontFamiliesListT, FontWeightsListT } from '@/styles/theme/fonts';
import { Text, TextProps } from 'react-native';

export interface ICustomTextProps extends TextProps {
    fontFamily?: FontFamiliesListT;
    fontWeight?: FontWeightsListT;
    textClass?: string;
}

const CustomText = ({ fontFamily = 'urbanist', fontWeight = 400, textClass, ...props }: ICustomTextProps) => {

  const font = FONTS[fontFamily][fontWeight];
  return (
    <Text {...props} style={[{ fontFamily: font }, props.style]} className={textClass} />
  );
};

export default CustomText;