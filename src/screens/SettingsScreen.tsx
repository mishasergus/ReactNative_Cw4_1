import {
  ScrollView,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContent';
import ThemeToggleComponent from '../components/themeToggleComponent'
import SetUsernameComponent from '../components/setUsernameComponent'
import DifficultyToggleComponent from '../components/difficultyToggleComponent'

export default function ExploreScreen() {
    const insets = useSafeAreaInsets();
    const {theme} = useTheme()!;
    const isDark = theme === 'dark';
    const colors = isDark
      ? { background: '#101512', text: '#F4FFF7', accent: '#79D25B' }
      : { background: '#EDF7E8', text: '#17331D', accent: '#3DAE2B' };

    const styles = createStyles(insets.top, insets.bottom, colors);

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <Text style={styles.title}>Snake Settings</Text>
          <Text style={styles.subtitle}>Customize your next run</Text>
        </View>

        <View style={styles.cards}>
          <ThemeToggleComponent />
          <SetUsernameComponent />
          <DifficultyToggleComponent />
        </View>
      </ScrollView>
    );
}

const createStyles = (
  topInset: number,
  bottomInset: number,
  colors: { background: string; text: string; accent: string }
) => {
  const safeBottom = bottomInset > 0 ? bottomInset : 12;
  const bottomScrollPadding = safeBottom + 96;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingTop: topInset + 24,
      paddingHorizontal: 20,
      paddingBottom: bottomScrollPadding,
    },
    header: {
      marginBottom: 18,
    },
    headerAccent: {
      width: 48,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
      marginBottom: 12,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    subtitle: {
      color: colors.text,
      opacity: 0.62,
      marginTop: 4,
      fontSize: 15,
    },
    cards: {
      gap: 14,
    },
  });
};