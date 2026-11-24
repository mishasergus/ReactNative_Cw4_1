import { useTheme } from '../context/ThemeContent';
import {
  Text,
  View,
  StyleSheet,
  Switch,
} from 'react-native';

export default function ThemeToggleComponent() {
    const {theme, toggleTheme} = useTheme()!;
    const isDark = theme === 'dark';
    const palette = isDark
      ? { card: '#1B241E', border: '#344A39', text: '#F4FFF7', muted: '#AAB8AD', track: '#354139' }
      : { card: '#FFFFFF', border: '#D9E8D4', text: '#17331D', muted: '#607565', track: '#C9D6C5' };
    const styles = createStyles(palette);

    return(
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text style={styles.label}>Theme</Text>
              <Text style={styles.value}>{theme === 'light' ? 'Light' : 'Dark'} mode</Text>
            </View>
            <Switch
              onValueChange={toggleTheme}
              value={theme === 'light'}
              trackColor={{ false: palette.track, true: '#79D25B' }}
              thumbColor={theme === 'light' ? '#FFFFFF' : '#A6B7AA'}
              ios_backgroundColor={palette.track}
            />
          </View>
        </View>
    );
}

const createStyles = (palette: {
  card: string;
  border: string;
  text: string;
  muted: string;
  track: string;
}) => StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
  },
  label: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
});