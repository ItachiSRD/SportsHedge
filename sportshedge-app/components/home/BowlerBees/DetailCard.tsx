import { View } from 'react-native';
import PressableBtn from '../../general/buttons/PressableBtn';
import CustomText from '../../general/Text';
import HeartOulinedIcon from '@/assets/icons/heartoutlined.svg';
import HeartSolidIcon from '@/assets/icons/heartsolid.svg';
import BriefCaseIcon from '@/assets/icons/briefcase-blank.svg';
import { colors } from '@/styles/theme/colors';
import TradeType from '@/components/general/TradeType';

interface IBeesDetailCardProps {
    name: string;
    quantity?: number;
    isFavorite?: boolean;
    toggleFavorite?: () => void;
}

const BeesDetailCard = ({ name, quantity, isFavorite, toggleFavorite }: IBeesDetailCardProps) => {
  
  return (
    <View style={{ gap: 16 }} className="flex-row px-[30px] pb-6 justify-between">
      <View style={{ gap: 8 }}>
        <CustomText
          fontWeight={500}
          textClass="text-lg leading-[27px] tracking-[0.72px] text-brand-content">
          {name}
        </CustomText>
        <View style={{gap: 16}} className='flex-row items-center'>
        <TradeType text='INDEX'/>
        {quantity ? (
          <View style={{ gap: 4 }} className="flex-row items-center">
            <BriefCaseIcon fill={colors['theme-content-active']} />
            <CustomText textClass="text-theme-content-active text-xs leading-[18px] tracking-[0.48px]">
              {quantity}
            </CustomText>
          </View>
      ) : null}
        </View>
      </View>
      <PressableBtn onPress={toggleFavorite}>
        {isFavorite ? <HeartSolidIcon /> : <HeartOulinedIcon />}
      </PressableBtn>
    </View>
  );
};

export default BeesDetailCard;