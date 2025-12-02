import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ManualEntryPane: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Inputs</Text>
      <Text style={styles.item}>• Add sleep sessions, workouts, meals, and social events.</Text>
      <Text style={styles.item}>• Quick-add calorie totals and homework/work blocks.</Text>
      <Text style={styles.item}>• Override device-imported records when needed.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginVertical: 4,
  },
});
