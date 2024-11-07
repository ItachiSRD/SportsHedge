import { View } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import ContractIcon from '@/assets/icons/contract.svg';
import CustomText from '@/components/general/Text';
import Button from '@/components/general/buttons/Button';
import { colors } from '@/styles/theme/colors';

interface IPortfolioEmptyStateProps {
  handleDiscoverPlayers?: () => void;
}

const PortfolioEmptyState = ({ handleDiscoverPlayers }: IPortfolioEmptyStateProps) => {
  return (
    <BaseScreen>
      <View style={{ gap: 44 }} className="flex-1 justify-center p-[30px] items-center">
        <ContractIcon fill={colors['theme-content-secondary']} />
        <View style={{ gap: 12 }}>
          <CustomText textClass="text-lg leading-[27px] tracking-[0.72px] text-global-gray-20 text-center">You don’t have any players stocks in your Portfolio</CustomText>
          <CustomText fontWeight={500} textClass="text-global-gray-20 text-center">Place buy / sell order from players</CustomText>
        </View>
        <Button
          title="Discover Players"
          containerClass="w-full border-brand-content rounded-[10px]"
          textClass="text-brand-content text-base leading-[24px] tracking-[0.64px]"
          variant="outlined"
          size="large"
          onPress={handleDiscoverPlayers}
        />
      </View>
    </BaseScreen>
  );
};

export default PortfolioEmptyState;