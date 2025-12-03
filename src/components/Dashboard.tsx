import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';
import { BodySilhouette } from './BodySilhouette';
import { DailyStats, MonthlySummary, YearlySummary, MuscleGroup } from '../models/stats';
import { SummaryPane } from './SummaryPane';
import { ManualEntryPane } from './ManualEntryPane';
import { palette, surfaces, typography } from '../theme';

interface Props {
  stats: DailyStats;
  monthly?: MonthlySummary;
  yearly?: YearlySummary;
  onManualUpdate?: (partial: Partial<DailyStats>) => void;
}

function computeMuscleGroups(stats: DailyStats): MuscleGroup[] {
  const groups: MuscleGroup[] = [];
  stats.workouts.forEach((workout) => groups.push(...workout.muscleGroups));
  return groups;
}

function computeHp(stats: DailyStats): number {
  const sleepHours = stats.sleep.reduce((acc, s) => acc + s.durationMinutes / 60, 0);
  const workoutMinutes = stats.workouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  const hrVariability = Math.max(0, 10 - (stats.heartRate.length ? 0 : 10));
  const capped = Math.min(100, Math.round(40 + sleepHours * 5 + workoutMinutes / 3 + hrVariability));
  return capped;
}

function computeEnergy(stats: DailyStats): number {
  const sleepHours = stats.sleep.reduce((acc, s) => acc + s.durationMinutes / 60, 0);
  return Math.min(100, Math.round((sleepHours / 8) * 100));
}

function HexGridBackground() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="hex" width="20" height="22" patternUnits="userSpaceOnUse" y="2">
          <Path
            d="M5 2 L15 2 L20 11 L15 20 L5 20 L0 11 Z"
            stroke="rgba(120, 229, 255, 0.12)"
            strokeWidth="1"
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#hex)" />
    </Svg>
  );
}

export const Dashboard: React.FC<Props> = ({ stats, monthly, yearly, onManualUpdate }) => {
  const { width: screenWidth } = useWindowDimensions();
  const muscles = useMemo(() => computeMuscleGroups(stats), [stats]);
  const hp = useMemo(() => computeHp(stats), [stats]);
  const energy = useMemo(() => computeEnergy(stats), [stats]);
  const mp = useMemo(() => Math.min(100, Math.max(20, 70 + stats.social.length * 6 - stats.work.length * 2)), [stats]);
  const cardWidth = Math.min(screenWidth * 0.9, 420);

  const StatusChip = ({ label, value, tone, icon }: { label: string; value: string; tone: string; icon: string }) => (
    <View style={[styles.chip, { borderColor: tone, shadowColor: tone }]}> 
      <Text style={[styles.chipLabel, { color: tone }]}>{icon}</Text>
      <Text style={[styles.chipText, { color: tone }]}>{label}</Text>
      <Text style={[styles.chipValue, { color: tone }]}>{value}</Text>
    </View>
  );

  const StatRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.statRow}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statText}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToAlignment="start"
      snapToInterval={cardWidth + 24}
      contentContainerStyle={[styles.swipeContainer, { paddingHorizontal: (screenWidth - cardWidth) / 2 + 12 }]}
    >
      <View style={[styles.panel, { width: cardWidth }]}> 
        <HexGridBackground />
        <View style={styles.panelHeader}>
          <Text style={styles.heading}>Today // OPERATIONS</Text>
          <View style={styles.chipRow}>
            <StatusChip label="HP" value={`${hp}%`} tone="#5cf6c5" icon="❤️" />
            <StatusChip label="MP" value={`${mp}%`} tone="#6cb3ff" icon="💧" />
            <StatusChip label="EN" value={`${energy}%`} tone="#f6e45c" icon="⚡" />
          </View>
        </View>
        <View style={styles.row}>
          <BodySilhouette activeMuscles={muscles} />
          <View style={styles.statsCol}>
            <ProgressBar label="HP" value={hp} color={palette.accent} />
            <ProgressBar label="Sleep Energy" value={energy} color={palette.accentSecondary} />
            <Text style={styles.statLine}>Workouts: {stats.workouts.length}</Text>
            <Text style={styles.statLine}>Sleep: {stats.sleep.length} sessions</Text>
            <Text style={styles.statLine}>Calories: {stats.meals.reduce((a, b) => a + b.calories, 0)}</Text>
            <Text style={styles.statLine}>Gaming: {stats.gaming.reduce((a, g) => a + g.durationMinutes, 0)} mins</Text>
          </View>
        </View>
      </View>

      <View style={[styles.panel, { width: cardWidth }]}> 
        <HexGridBackground />
        <ManualEntryPane onApply={onManualUpdate} />
      </View>

      <View style={[styles.panel, { width: cardWidth }]}> 
        <HexGridBackground />
        <SummaryPane monthly={monthly} yearly={yearly} />
      </View>
    </ScrollView>
  );
};

function NeonProgressBar({
  label,
  value,
  gradient,
  icon,
}: {
  label: string;
  value: number;
  gradient: [string, string];
  icon: string;
}) {
  const [barWidth, setBarWidth] = useState(0);
  const gradientId = `grad-${label.replace(/\s+/g, '-')}`;

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>
          {icon} {label}
        </Text>
        <Text style={styles.barValue}>{value}%</Text>
      </View>
      <View
        style={styles.barBackground}
        onLayout={(e) => {
          setBarWidth(e.nativeEvent.layout.width);
        }}
      >
        {barWidth > 0 && (
          <Svg width={barWidth} height={16}>
            <Defs>
              <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={gradient[0]} stopOpacity="0.95" />
                <Stop offset="100%" stopColor={gradient[1]} stopOpacity="0.95" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={barWidth} height={16} rx={8} fill="rgba(255,255,255,0.08)" />
            <Rect x="0" y="0" width={(barWidth * value) / 100} height={16} rx={8} fill={`url(#${gradientId})`} />
            <Rect
              x="0"
              y="0"
              width={(barWidth * value) / 100}
              height={16}
              rx={8}
              fill={`url(#${gradientId})`}
              opacity={0.35}
              strokeWidth={6}
              stroke={`url(#${gradientId})`}
            />
          </Svg>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    flexGrow: 1,
    paddingVertical: 18,
    backgroundColor: '#050712',
  },
  panel: {
    width: 360,
    ...surfaces.panel,
  },
  heading: {
    ...typography.heading,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsCol: {
    flex: 1,
    gap: 10,
  },
  barContainer: {
    marginBottom: 12,
  },
  barLabel: {
    ...typography.label,
    marginBottom: 4,
  },
  barBackground: {
    width: '100%',
    height: 10,
    backgroundColor: palette.progressTrack,
    borderRadius: 8,
  },
  statIcon: {
    marginRight: 8,
    fontSize: 15,
  },
  statText: {
    flex: 1,
    color: '#cce7ff',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  statValue: {
    color: '#8ef7ff',
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(14, 21, 40, 0.8)',
    borderWidth: 1,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  chipLabel: {
    fontSize: 12,
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 6,
  },
  statLine: {
    ...typography.body,
    marginVertical: 2,
  },
});
