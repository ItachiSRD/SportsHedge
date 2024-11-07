import EditProfileScreen from '@/screens/profile/EditProfile';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import ReferralScreen from '@/screens/referral/ReferralScreen';
import EarningsScreen from '@/screens/referral/EarningsScreen';
import FundsScreen from '@/screens/wallet/FundsScreen';
import { ProfileStackListT } from '@/types/navigation/RootStackParams';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AadharScreen from '@/screens/profile/kyc/Aadhar';
import DrivingLicenceScreen from '@/screens/profile/kyc/DrivingLicence';
import LockedFunds from '@/screens/LockedFunds';
import LearnScreen from '@/screens/profile/Learn';
import PricingModelScreen from '@/screens/profile/Learn/PricingModel';
import FantasyPointScoringSystemScreen from '@/screens/profile/Learn/FPSS';

const Stack = createStackNavigator<ProfileStackListT>();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Funds" component={FundsScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="Earnings" component={EarningsScreen} />
        <Stack.Screen name="AadharKYC" component={AadharScreen} />
        <Stack.Screen name="DrivingLicenceKYC" component={DrivingLicenceScreen} />
        <Stack.Screen name="LockedFunds" component={LockedFunds} />
        <Stack.Screen name="Learn" component={LearnScreen} />
        <Stack.Screen name="PricingModel" component={PricingModelScreen} />
        <Stack.Screen name="FantasyPointScoringSystem" component={FantasyPointScoringSystemScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ProfileStack;
