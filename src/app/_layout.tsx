import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContent';
import { DifficultyProvider } from '../context/DifficultyContent';
import { UserProvider } from '../context/UserContent';


import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DifficultyProvider>
          <NavigationContainer>
            <UserProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </UserProvider>
          </NavigationContainer>
        </DifficultyProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
