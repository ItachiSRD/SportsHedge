import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamsListT } from '@/types/navigation/RootStackParams';
import Onboarding from '@/screens/Onboarding';

const Stack = createStackNavigator<AuthStackParamsListT>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Onboarding} />
    </Stack.Navigator>
  );
};

export default AuthStack;