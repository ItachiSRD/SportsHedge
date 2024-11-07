import PlaceOrderScreen from '@/screens/players/PlaceOrder';
import PlayersLandingScreen from '@/screens/players/PlayersLanding/PlayersLandingScreen';
import { PlayersStackT } from '@/types/navigation/RootStackParams';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<PlayersStackT>();

const PlayersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='PlayersLanding'>
      <Stack.Screen name="PlayersLanding" component={PlayersLandingScreen} />
      <Stack.Screen name="PlaceOrders" component={PlaceOrderScreen} />
    </Stack.Navigator>
  );
};

export default PlayersStack;
