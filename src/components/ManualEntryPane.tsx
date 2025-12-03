import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { DailyStats, MuscleGroup } from '../models/stats';

interface Props {
  onApply?: (partial: Partial<DailyStats>) => void;
}

export const ManualEntryPane: React.FC<Props> = ({ onApply }) => {
  const [sleepHours, setSleepHours] = useState('');
  const [workoutMinutes, setWorkoutMinutes] = useState('');
  const [calories, setCalories] = useState('');
  const [gamingMinutes, setGamingMinutes] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      <View style={styles.headerRow}>
        <View style={styles.accent} />
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Manual Inputs</Text>
          <Text style={styles.caption}>Fill any field you want to update, then tap Apply.</Text>
        </View>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.icon}>😴</Text>
        <View style={styles.fieldContent}>
          <Text style={styles.label}>Sleep (hours)</Text>
          <TextInput
            placeholder="7.5 hrs"
            placeholderTextColor="#a5b4fc"
            keyboardType="decimal-pad"
            value={sleepHours}
            onChangeText={setSleepHours}
            style={[styles.input, focusedField === 'sleep' && styles.inputFocused]}
            onFocus={() => setFocusedField('sleep')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.icon}>💪</Text>
        <View style={styles.fieldContent}>
          <Text style={styles.label}>Workout (minutes)</Text>
          <TextInput
            placeholder="45 min blast"
            placeholderTextColor="#a5f3fc"
            keyboardType="numeric"
            value={workoutMinutes}
            onChangeText={setWorkoutMinutes}
            style={[styles.input, focusedField === 'workout' && styles.inputFocused]}
            onFocus={() => setFocusedField('workout')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.icon}>🔥</Text>
        <View style={styles.fieldContent}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            placeholder="2100 kcal"
            placeholderTextColor="#fcd34d"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
            style={[styles.input, focusedField === 'calories' && styles.inputFocused]}
            onFocus={() => setFocusedField('calories')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.icon}>🎮</Text>
        <View style={styles.fieldContent}>
          <Text style={styles.label}>Gaming (minutes)</Text>
          <TextInput
            placeholder="90 min session"
            placeholderTextColor="#c084fc"
            keyboardType="numeric"
            value={gamingMinutes}
            onChangeText={setGamingMinutes}
            style={[styles.input, focusedField === 'gaming' && styles.inputFocused]}
            onFocus={() => setFocusedField('gaming')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={!hasChanges}
        style={({ pressed }) => [
          styles.cta,
          pressed && styles.ctaPressed,
          !hasChanges && styles.ctaDisabled,
        ]}
      >
        <Svg
          style={StyleSheet.absoluteFill}
          viewBox="0 0 100 48"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <Defs>
            <LinearGradient id="ctaGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22d3ee" stopOpacity="0.95" />
              <Stop offset="1" stopColor="#a855f7" stopOpacity="0.95" />
            </LinearGradient>
            <LinearGradient id="ctaGlow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22d3ee" stopOpacity="0.55" />
              <Stop offset="1" stopColor="#a855f7" stopOpacity="0.55" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="48" rx="14" fill="url(#ctaGradient)" />
          <Rect
            x="-4"
            y="-6"
            width="108"
            height="60"
            rx="18"
            fill="url(#ctaGlow)"
            opacity={0.35}
          />
        </Svg>
        <Text style={styles.ctaText}>Apply updates</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1f2a44',
    borderRadius: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e2e8f0',
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  label: {
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  accent: {
    width: 4,
    height: 46,
    borderRadius: 4,
    backgroundColor: '#22d3ee',
    marginRight: 12,
  },
  headerCopy: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a44',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    color: '#e2e8f0',
    fontWeight: '600',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  inputFocused: {
    borderColor: '#22d3ee',
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },
  cta: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    shadowColor: '#22d3ee',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.3,
  },
  ctaDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  ctaText: {
    color: '#0b1220',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
