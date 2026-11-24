import { useDifficulty, Difficulty } from '../context/DifficultyContent';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContent';

const LEVELS: Difficulty[] = ['light', 'medium', 'hard'];

export default function DifficultyToggleComponent() {
    const {difficulty, toggleDifficulty} = useDifficulty()!;
    const {theme} = useTheme()!;
    const isDark = theme === 'dark';
    const palette = isDark
      ? { card: '#1B241E', border: '#344A39', text: '#F4FFF7', muted: '#AAB8AD', track: '#101512', activeText: '#17331D' }
      : { card: '#FFFFFF', border: '#D9E8D4', text: '#17331D', muted: '#607565', track: '#EDF4E9', activeText: '#17331D' };
    const styles = createStyles(palette);

    return(
        <View style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.label}>Difficulty</Text>
              <Text style={styles.value}>{difficulty}</Text>
            </View>
            <View style={styles.levels}>
                {LEVELS.map((level) => {
                const active = difficulty === level;
                return (
                    <TouchableOpacity
                    key={level}
                    onPress={() => toggleDifficulty(level)}
                    style={[styles.level, active && styles.activeLevel]}
                    activeOpacity={0.75}
                    >
                    <Text style={[styles.levelText, active && styles.activeLevelText]}>
                        {level}
                    </Text>
                    </TouchableOpacity>
                );
                })}
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
  activeText: string;
}) => StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  levels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    backgroundColor: palette.track,
    borderRadius: 14,
    padding: 5,
  },
  level: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLevel: {
    backgroundColor: '#79D25B',
  },
  levelText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  activeLevelText: {
    color: palette.activeText,
  },
});