import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { DailyStats, MuscleGroup } from '../models/stats';

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
        keyboardType="decimal-pad"
        value={sleepHours}
        onChangeText={setSleepHours}
        style={styles.input}
      />

      <Text style={styles.label}>Workout (minutes)</Text>
      <TextInput
        placeholder="e.g. 45"
        keyboardType="numeric"
        value={workoutMinutes}
        onChangeText={setWorkoutMinutes}
        style={styles.input}
      />

      <Text style={styles.label}>Calories</Text>
      <TextInput
        placeholder="e.g. 2100"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
        style={styles.input}
      />

      <Text style={styles.label}>Gaming (minutes)</Text>
      <TextInput
        placeholder="e.g. 90"
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
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(120, 229, 255, 0.18)',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
    color: '#eaf7ff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 13,
    color: '#b7d8ff',
    marginBottom: 12,
    fontWeight: '700',
  },
  label: {
    marginTop: 8,
    fontWeight: '800',
    color: '#cce7ff',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(120, 229, 255, 0.3)',
    backgroundColor: 'rgba(12, 20, 36, 0.9)',
    color: '#e7f7ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
