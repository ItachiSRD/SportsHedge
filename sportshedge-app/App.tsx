import 'react-native-gesture-handler';
import '@/lib/auth/socialAuth';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store';
import Routes from './routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts as useUrbanistFonts, Urbanist_300Light, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import AuthContextProvider from './context/auth';
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  const [urbanistFontsLoaded, urbanistFontError] = useUrbanistFonts({
    Urbanist_300Light, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold
  });

  if (!(urbanistFontsLoaded || urbanistFontError)) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <Provider store={store}>
        <AuthContextProvider>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <Routes />
            </BottomSheetModalProvider>
            <StatusBar style="light" />
          </SafeAreaProvider>
        </AuthContextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}