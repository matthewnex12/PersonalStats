import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { DailyStats, MuscleGroup } from '../models/stats';
import { palette, typography } from '../theme';

interface Props {
  onApply?: (partial: Partial<DailyStats>) => void;
}

export const ManualEntryPane: React.FC<Props> = ({ onApply }) => {
  const [sleepHours, setSleepHours] = useState('');
  const [workoutMinutes, setWorkoutMinutes] = useState('');
  const [calories, setCalories] = useState('');
  const [gamingMinutes, setGamingMinutes] = useState('');

  const hasChanges = useMemo(
    () => !!sleepHours || !!workoutMinutes || !!calories || !!gamingMinutes,
    [calories, gamingMinutes, sleepHours, workoutMinutes],
  );

  const parseNumber = (value: string) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : undefined;
  };

  const onSubmit = () => {
    if (!onApply) {
      return;
    }

    const sleep = parseNumber(sleepHours);
    const workout = parseNumber(workoutMinutes);
    const mealCalories = parseNumber(calories);
    const gaming = parseNumber(gamingMinutes);

    if (!sleep && !workout && !mealCalories && !gaming) {
      Alert.alert('Nothing to apply', 'Enter at least one value before applying.');
      return;
    }

    const now = new Date();
    const timestamp = now.toISOString();

    const partial: Partial<DailyStats> = {};

    if (sleep) {
      partial.sleep = [
        {
          id: `sleep-${timestamp}`,
          durationMinutes: sleep * 60,
          quality: 'good',
          start: timestamp,
          end: new Date(now.getTime() + sleep * 60 * 60 * 1000).toISOString(),
          source: 'manual',
        },
      ];
    }

    if (workout) {
      const muscleGroup: MuscleGroup = workout >= 45 ? 'full-body' : 'core';
      partial.workouts = [
        {
          id: `workout-${timestamp}`,
          type: 'strength',
          muscleGroups: [muscleGroup],
          durationMinutes: workout,
          caloriesBurned: workout * 7,
          timestamp,
          source: 'manual',
        },
      ];
    }

    if (mealCalories) {
      partial.meals = [
        {
          id: `meal-${timestamp}`,
          calories: mealCalories,
          timestamp,
          description: 'Manual calorie entry',
        },
      ];
    }

    if (gaming) {
      partial.gaming = [
        {
          id: `gaming-${timestamp}`,
          platform: 'manual',
          title: 'Manual session',
          durationMinutes: gaming,
          timestamp,
        },
      ];
    }

    onApply(partial);
    setSleepHours('');
    setWorkoutMinutes('');
    setCalories('');
    setGamingMinutes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Inputs</Text>
      <Text style={styles.caption}>Fill any field you want to update, then tap Apply.</Text>

      <Text style={styles.label}>Sleep (hours)</Text>
      <TextInput
        placeholder="e.g. 7.5"
        placeholderTextColor={palette.textSecondary}
        keyboardType="decimal-pad"
        value={sleepHours}
        onChangeText={setSleepHours}
        style={styles.input}
      />

      <Text style={styles.label}>Workout (minutes)</Text>
      <TextInput
        placeholder="e.g. 45"
        placeholderTextColor={palette.textSecondary}
        keyboardType="numeric"
        value={workoutMinutes}
        onChangeText={setWorkoutMinutes}
        style={styles.input}
      />

      <Text style={styles.label}>Calories</Text>
      <TextInput
        placeholder="e.g. 2100"
        placeholderTextColor={palette.textSecondary}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
        style={styles.input}
      />

      <Text style={styles.label}>Gaming (minutes)</Text>
      <TextInput
        placeholder="e.g. 90"
        placeholderTextColor={palette.textSecondary}
        keyboardType="numeric"
        value={gamingMinutes}
        onChangeText={setGamingMinutes}
        style={styles.input}
      />

      <Button title="Apply" onPress={onSubmit} disabled={!hasChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    ...typography.heading,
    marginBottom: 8,
  },
  caption: {
    ...typography.body,
    marginBottom: 12,
  },
  label: {
    ...typography.label,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.borderGlow,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
    color: palette.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
