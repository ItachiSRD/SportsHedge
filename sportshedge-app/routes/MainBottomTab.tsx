import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainBottomTabListT } from '@/types/navigation/RootStackParams';
import { colors } from '@/styles/theme/colors';
import TabButton from '@/components/general/Tab/TabButton';
import ProfileStack from './ProfileStack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeScreen from '@/screens/home/HomeScreen';
import PlayersStack from './PlayersStack';
import PortfolioScreen from '@/screens/portfolio/Portfolio';

const Tab = createBottomTabNavigator<MainBottomTabListT>();

const excludeTabOnRoutes = ['EditProfile', 'Funds', 'Referral', 'Earnings', 'PlaceOrders', 'AadharKYC', 'DrivingLicenceKYC','LockedFunds', 'Learn', 'PricingModel', 'FantasyPointScoringSystem', 'FAQs'];

const tabBarStyle = {
  backgroundColor: colors['theme-secondary'],
  height: 84,
  borderTopColor: colors['global-gray-50'],
  borderTopWidth: 1
};

const MainBottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (excludeTabOnRoutes.includes(routeName)) return { ...tabBarStyle, display: 'none' };

          return tabBarStyle;
        })(route),
        headerShown: false
      })}>
      <Tab.Screen
        options={{ tabBarButton: (props) => <TabButton {...props} tabName="home" title="Home" /> }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarButton: (props) => <TabButton {...props} tabName="players" title="Players" />
        }}
        name="PlayersStack"
        component={PlayersStack}
        listeners={({ navigation }) => ({
          tabPress: event => {
            // Prevent the default tab press
            event.preventDefault();
            
            // Navigate to a specific screen
            navigation.navigate('PlayersStack', { screen: 'PlayersLanding' });
          },
        })}
      />
      <Tab.Screen
        options={{
          tabBarButton: (props) => <TabButton {...props} tabName="portfolio" title="Portfolio" />
        }}
        name="PortFolio"
        component={PortfolioScreen}
      />
      <Tab.Screen
        options={{
          tabBarButton: (props) => <TabButton {...props} tabName="profile" title="Profile" />
        }}
        name="ProfileStack"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default MainBottomTab;
