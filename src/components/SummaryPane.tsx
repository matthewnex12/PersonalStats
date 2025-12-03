import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlySummary, YearlySummary } from '../models/stats';
import { typography } from '../theme';

interface Props {
  monthly?: MonthlySummary;
  yearly?: YearlySummary;
}

export const SummaryPane: React.FC<Props> = ({ monthly, yearly }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Summary</Text>
      {monthly ? (
        <>
          <Text style={styles.item}>🏋️ Workouts: {monthly.totalWorkouts} ({monthly.totalWorkoutMinutes} mins)</Text>
          <Text style={styles.item}>🌙 Sleep: {Math.round(monthly.totalSleepMinutes / 60)} hrs total</Text>
          <Text style={styles.item}>🔥 Calories: {monthly.totalCalories}</Text>
          <Text style={styles.item}>🛰️ Work/Homework: {monthly.totalWorkMinutes} mins</Text>
          <Text style={styles.item}>🤝 Social events: {monthly.totalSocialEvents}</Text>
          <Text style={styles.item}>🎮 Gaming: {monthly.totalGamingMinutes} mins</Text>
        </>
      ) : (
        <Text style={styles.item}>No monthly data yet.</Text>
      )}

      <Text style={[styles.title, styles.spaced]}>Yearly Summary</Text>
      {yearly ? (
        yearly.months.map((month) => (
          <Text key={month.month} style={styles.item}>
            {month.month}: {month.totalWorkouts} workouts, {Math.round(month.totalSleepMinutes / 60)} hrs sleep,
            {month.totalCalories} kcal
          </Text>
        ))
      ) : (
        <Text style={styles.item}>No yearly data yet.</Text>
      )}
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
    ...typography.heading,
    marginBottom: 8,
    color: '#eaf7ff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  spaced: {
    marginTop: 16,
  },
  item: {
    ...typography.body,
    marginVertical: 4,
    color: '#d5eaff',
    fontWeight: '700',
  },
});
