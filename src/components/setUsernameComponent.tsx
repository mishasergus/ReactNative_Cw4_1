import { useUser } from '../context/UserContent';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContent';

export default function SetUsernameComponent() {
    const {username, toggleUsername} = useUser()!;
    const {theme} = useTheme()!;
    const isDark = theme === 'dark';
    const palette = isDark
      ? { card: '#1B241E', border: '#344A39', text: '#F4FFF7', muted: '#AAB8AD', input: '#101512' }
      : { card: '#FFFFFF', border: '#D9E8D4', text: '#17331D', muted: '#607565', input: '#F7FBF4' };
    const styles = createStyles(palette);

    return(
        <View style={styles.card}>
            <Text style={styles.label}>Player name</Text>
            <Text style={styles.currentName}>{username}</Text>
            <TextInput
                value={username}
                onChangeText={toggleUsername}
                placeholder="Enter username"
                placeholderTextColor={palette.muted}
                style={styles.input}
                selectionColor="#55B43D"
                maxLength={24}
            />
        </View>
    );
}

const createStyles = (palette: {
  card: string;
  border: string;
  text: string;
  muted: string;
  input: string;
}) => StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
  },
  label: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currentName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  input: {
    marginTop: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.input,
    color: palette.text,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});