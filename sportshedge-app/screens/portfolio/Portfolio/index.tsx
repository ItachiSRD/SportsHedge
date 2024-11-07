import { View } from 'react-native';
import { useState, useEffect } from 'react';
import PortfolioEmptyState from '@/components/portfolio/PortfolioEmptyState';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainBottomTabListT } from '@/types/navigation/RootStackParams';
import BaseScreen from '@/screens/BaseScreen';
import { colors } from '@/styles/theme/colors';
import PortfolioNoHoldings from '@/components/portfolio/PortfolioNoHoldings';
import PortofolioTabs from '@/components/portfolio/PortofolioTabs';
import PortfolioOrders from './PortfolioOrders';
import InvestmentSummaryCard from '@/components/portfolio/InvestmentSummaryCard';
import PortfolioHoldings from './PortfolioHoldings';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { getOrdersAction } from '@/store/slices/order/action';
import { useIsFocused } from '@react-navigation/native';
import { getUserInvestmentsAction } from '@/store/slices/user/action';

type PortfolioOrderScreenProps = BottomTabScreenProps<MainBottomTabListT, 'PortFolio'>;

const PortfolioScreen = ({ navigation }: PortfolioOrderScreenProps) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { orders } = useAppSelector((state) => state.orderSlice);
  const userInvestments = useAppSelector((state) => state.userSlice.userInvestMents);

  const holdings = [];

  const [selectedTab, setSelectedTab] = useState<'Holdings' | 'Orders'>('Orders');

  useEffect(() => {
    if (isFocused) {
      dispatch(getUserInvestmentsAction());
      dispatch(getOrdersAction({ pageNo: orders.hasMoreData ? orders.pageNo + 1 : orders.pageNo }));
    }
  }, [isFocused]);

  if (!(orders.data.length || holdings.length)) {
    return <PortfolioEmptyState handleDiscoverPlayers={() => navigation.navigate('PlayersStack', { screen: 'PlayersLanding' })} />;
  }
  
  return (
    <BaseScreen style={{ backgroundColor: colors['global-gray-80'] }}>
      {holdings.length ? (
        <InvestmentSummaryCard
          investedAmount={userInvestments.data.investedAmount}
          currentValue={userInvestments.data.currentValue}
        />
      ) : (
        <PortfolioNoHoldings />
      )}
      <PortofolioTabs
        showHoldings={holdings.length > 0}
        selectedTab={selectedTab}
        handleToggle={setSelectedTab}
      />
      <View className="bg-theme-secondary flex-1">
        {selectedTab == 'Holdings' ? <PortfolioHoldings /> : <PortfolioOrders />}
      </View>
    </BaseScreen>
  );
};

export default PortfolioScreen;