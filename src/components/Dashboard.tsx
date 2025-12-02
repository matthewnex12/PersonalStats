import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BodySilhouette } from './BodySilhouette';
import { DailyStats, MonthlySummary, YearlySummary, MuscleGroup } from '../models/stats';
import { SummaryPane } from './SummaryPane';
import { ManualEntryPane } from './ManualEntryPane';

interface Props {
  stats: DailyStats;
  monthly?: MonthlySummary;
  yearly?: YearlySummary;
<<<<<<< ours
=======
  onManualUpdate?: (partial: Partial<DailyStats>) => void;
>>>>>>> theirs
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

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel}>
        {label}: {value}%
      </Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

<<<<<<< ours
export const Dashboard: React.FC<Props> = ({ stats, monthly, yearly }) => {
=======
export const Dashboard: React.FC<Props> = ({ stats, monthly, yearly, onManualUpdate }) => {
>>>>>>> theirs
  const muscles = useMemo(() => computeMuscleGroups(stats), [stats]);
  const hp = useMemo(() => computeHp(stats), [stats]);
  const energy = useMemo(() => computeEnergy(stats), [stats]);

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.swipeContainer}
    >
      <View style={styles.panel}>
        <Text style={styles.heading}>Today</Text>
        <View style={styles.row}>
          <BodySilhouette activeMuscles={muscles} />
          <View style={styles.statsCol}>
            <ProgressBar label="HP" value={hp} color="#7dd97d" />
            <ProgressBar label="Sleep Energy" value={energy} color="#7db7ff" />
            <Text style={styles.statLine}>Workouts: {stats.workouts.length}</Text>
            <Text style={styles.statLine}>Sleep: {stats.sleep.length} sessions</Text>
            <Text style={styles.statLine}>Calories: {stats.meals.reduce((a, b) => a + b.calories, 0)}</Text>
            <Text style={styles.statLine}>Gaming: {stats.gaming.reduce((a, g) => a + g.durationMinutes, 0)} mins</Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
<<<<<<< ours
        <ManualEntryPane />
=======
        <ManualEntryPane onApply={onManualUpdate} />
>>>>>>> theirs
      </View>

      <View style={styles.panel}>
        <SummaryPane monthly={monthly} yearly={yearly} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    flexGrow: 1,
  },
  panel: {
    width: 360,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCol: {
    marginLeft: 12,
    flex: 1,
  },
  barContainer: {
    marginBottom: 10,
  },
  barLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  barBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
  barFill: {
    height: 10,
    borderRadius: 8,
  },
  statLine: {
    fontSize: 14,
    marginVertical: 2,
  },
});
