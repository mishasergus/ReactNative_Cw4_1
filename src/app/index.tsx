import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import GameScreen from '../screens/GameScreen';
import RecordsScreen from '../screens/RecordsScreen';
import SettingsScreen from '../screens/SettingsScreen';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();


const TABS: Record<string, { label: string; icon: string }> = {
  Game: { label: 'Game', icon: 'gamepad' },
  Records: { label: 'Records', icon: 'book' },
  Settings: { label: 'Settings', icon: 'cog' },
};

export default function Router() {
  const insets = useSafeAreaInsets();

  const styles = createStyles(insets.bottom);
  const colors = {
    primary: '#17331D',
    muted: '#718276',
    accent: '#55B43D',
  };

  return (
    <View style={styles.root}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const { label, icon } = TABS[route.name];
          return {
            headerShown: false, 
            animation: 'none',
            sceneStyle: styles.sceneBackground,
            tabBarLabel: label,
            tabBarLabelPosition: 'below-icon', 
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarItemStyle: styles.tabBarItem,
            tabBarIconStyle: styles.tabBarIcon,
            tabBarStyle: styles.tabBar,
            tabBarBackground: () => (
              <View pointerEvents="none" style={styles.tabBarBackground}>
                <View style={styles.tabBarSurface} />
              </View>
            ),
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome5 
                name={icon} 
                size={30} 
                color={focused ? colors.accent : color} 
                solid={focused} 
              />
            ),
          };
        }}
      >
        <Tab.Screen name="Game" component={GameScreen} />
        <Tab.Screen name="Records" component={RecordsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

const createStyles = (bottomInset: number) => {
  const safeBottom = bottomInset > 0 ? bottomInset : 12;
  const barHeight = 76 + safeBottom;
  
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#EDF7E8',
    },
    sceneBackground: {
      backgroundColor: '#EDF7E8',
    },
    tabBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 10 + safeBottom * 0.15,
      height: barHeight,
      borderTopWidth: 0,
      borderRadius: 24,
      backgroundColor: 'transparent',
      elevation: 8,
      shadowColor: '#17331D',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      paddingTop: 8,
      paddingBottom: 8 + safeBottom * 0.25,
    },
    tabBarBackground: {
      ...StyleSheet.absoluteFill,
      borderRadius: 24,
      overflow: 'hidden',
    },
    tabBarSurface: {
      ...StyleSheet.absoluteFill,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D9E8D4',
      borderRadius: 24,
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '700',
      marginTop: 2,
    },
    tabBarItem: {
      borderRadius: 18,
    },
    tabBarIcon: {
      marginTop: 4,
    },
  });
};