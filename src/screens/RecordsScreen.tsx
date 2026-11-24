import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDifficulty, type Record } from '../context/DifficultyContent';
import { useTheme } from '../context/ThemeContent';
import { useUser } from '../context/UserContent';

export default function RecordsScreen() {
  const insets = useSafeAreaInsets();
  const { records, clearRecords } = useDifficulty()!;
  const { theme } = useTheme()!;
  const { username } = useUser()!;
  const isDark = theme === 'dark';
  const palette = isDark
    ? {
        background: '#101512',
        surface: '#1B241E',
        text: '#F4FFF7',
        muted: '#AAB8AD',
        border: '#344A39',
        accent: '#79D25B',
      }
    : {
        background: '#EDF7E8',
        surface: '#FFFFFF',
        text: '#17331D',
        muted: '#607565',
        border: '#D9E8D4',
        accent: '#55B43D',
      };
  const styles = createStyles(insets.top, insets.bottom, palette);

  const sortedRecords = [...records].sort((a, b) => b.score - a.score);
  const bestScore = sortedRecords[0]?.score ?? 0;

  const renderRecord = ({ item, index }: { item: Record; index: number }) => (
    <View style={[styles.recordCard, index === 0 && styles.bestRecordCard]}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.recordCopy}>
        <Text style={styles.recordScore}>{item.score} points</Text>
        <Text style={styles.recordDifficulty}>{item.difficulty} difficulty</Text>
      </View>
      {index === 0 && <Text style={styles.bestLabel}>Best</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.title}>Snake Records</Text>
        <Text style={styles.subtitle}>{username}</Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{bestScore}</Text>
          <Text style={styles.summaryLabel}>Best score</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{records.length}</Text>
          <Text style={styles.summaryLabel}>Games</Text>
        </View>
      </View>

      {sortedRecords.length > 0 ? (
        <>
          <FlatList
            data={sortedRecords}
            keyExtractor={(_, index) => `${sortedRecords[index].score}-${sortedRecords[index].difficulty}-${index}`}
            renderItem={renderRecord}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearRecords}
            activeOpacity={0.75}
          >
            <Text style={styles.clearText}>Clear records</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No records yet</Text>
          <Text style={styles.emptyText}>Finish a game to add your first score.</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (
  topInset: number,
  bottomInset: number,
  palette: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
  }
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
      paddingTop: topInset + 24,
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 18,
    },
    headerAccent: {
      width: 48,
      height: 6,
      borderRadius: 3,
      backgroundColor: palette.accent,
      marginBottom: 12,
    },
    title: {
      color: palette.text,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    subtitle: {
      color: palette.muted,
      marginTop: 4,
      fontSize: 15,
    },
    summary: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 18,
      paddingVertical: 16,
      marginBottom: 14,
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryDivider: {
      width: 1,
      height: 38,
      backgroundColor: palette.border,
    },
    summaryValue: {
      color: palette.text,
      fontSize: 24,
      fontWeight: '800',
    },
    summaryLabel: {
      color: palette.muted,
      fontSize: 12,
      marginTop: 2,
    },
    listContent: {
      gap: 10,
      paddingBottom: 96,
    },
    recordCard: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 72,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface,
      paddingHorizontal: 14,
    },
    bestRecordCard: {
      borderColor: palette.accent,
    },
    rankBadge: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: palette.accent,
      marginRight: 12,
    },
    rankText: {
      color: '#17331D',
      fontSize: 16,
      fontWeight: '800',
    },
    recordCopy: {
      flex: 1,
    },
    recordScore: {
      color: palette.text,
      fontSize: 17,
      fontWeight: '800',
    },
    recordDifficulty: {
      color: palette.muted,
      fontSize: 13,
      marginTop: 2,
      textTransform: 'capitalize',
    },
    bestLabel: {
      color: palette.accent,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    clearButton: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: bottomInset + 88,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface,
    },
    clearText: {
      color: palette.muted,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 140,
    },
    emptyTitle: {
      color: palette.text,
      fontSize: 20,
      fontWeight: '800',
    },
    emptyText: {
      color: palette.muted,
      marginTop: 6,
      textAlign: 'center',
    },
  });
