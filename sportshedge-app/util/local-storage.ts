import { USER_DATA_KEY } from '@/constants/local-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISavedUserData {
    userInp: {
        referralCode?: string;
        countryCode: string;
        number: string;
    }
}

export const saveUserDataToLocalStorage = async (value: ISavedUserData) => {
  return AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(value));
};

export const getUserDataFromLocalStorage = async (): Promise<ISavedUserData | undefined> => {
  const data = await AsyncStorage.getItem(USER_DATA_KEY);
  if (data) {
    return JSON.parse(data);
  }
};