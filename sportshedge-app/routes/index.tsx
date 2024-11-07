import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation/RootStackParams';
import { useAuthStateContext } from '../context/auth';
import { useAuthListener } from '@/hooks/auth/useAuthListener';
import MainBottomTab from './MainBottomTab';
import { colors } from '@/styles/theme/colors';
import NotificationScreen from '@/screens/Notification/NotificationScreen';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect } from 'react';
import { getUserDetailsAction } from '@/store/slices/user/action';
import CustomLoader from '@/components/general/status/Loader/CustomLoader';
import AuthStack from './AuthStack';
import BowlerBeesScreen from '@/screens/BowlerBees';

const Stack = createStackNavigator<RootStackParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors['theme-reverse-content-primary']
  },
};

const Routes = () => {
  // Listen for auth state changes
  useAuthListener();
  const dispatch = useAppDispatch();
  
  const { authUser, updateUserName } = useAuthStateContext();
  const { status, user } = useAppSelector((state) => state.userSlice);

  useEffect(() => {
    if (authUser?.uid && !user?.id) {
      dispatch(getUserDetailsAction());
    }
  }, [authUser, user?.id]);

  useEffect(() => {
    async function updateUserData() {
      if (user && user?.firstName !== authUser?.displayName) {
        await updateUserName(user.firstName);
      }
    }
    updateUserData();
  }, [user, authUser]);

  if (status === 'loading' && !user) {
    return <CustomLoader containerClass="w-full flex-1 justify-center items-center bg-theme-reverse-content-primary" />;
  }

  const userRegistered = !!user;

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {(authUser && userRegistered) ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Main' component={MainBottomTab} />
            <Stack.Screen name='Notifications' component={NotificationScreen} />
            <Stack.Screen name='BowlerBees' component={BowlerBeesScreen} />
          </Stack.Group>
        ): (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;