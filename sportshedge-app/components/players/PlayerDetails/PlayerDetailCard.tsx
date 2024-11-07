import { View } from 'react-native';
import PressableBtn from '../../general/buttons/PressableBtn';
import CustomText from '../../general/Text';
import HeartOulinedIcon from '@/assets/icons/heartoutlined.svg';
import HeartSolidIcon from '@/assets/icons/heartsolid.svg';
import { PlayerRolesT } from '@/types/entities/player';
import PlayerBasicDetails from './PlayerBasicDetails';

interface IPlayerDetailCardProps {
    name: string;
    countryCode: string;
    playerRole: PlayerRolesT;
    quantity?: number;
    isFavorite?: boolean;
    toggleFavorite?: () => void;
}

const PlayerDetailCard = ({ name, countryCode, playerRole, quantity, isFavorite, toggleFavorite }: IPlayerDetailCardProps) => {
  
  return (
    <View style={{ gap: 16 }} className="flex-row px-[30px] pb-6 justify-between">
      <View style={{ gap: 8 }}>
        <CustomText
          fontWeight={500}
          textClass="text-lg leading-[27px] tracking-[0.72px] text-brand-content">
          {name}
        </CustomText>
        <PlayerBasicDetails playerRole={playerRole} quantity={quantity} countryCode={countryCode} />
      </View>
      <PressableBtn onPress={toggleFavorite}>
        {isFavorite ? <HeartSolidIcon /> : <HeartOulinedIcon />}
      </PressableBtn>
    </View>
  );
};

export default PlayerDetailCard;