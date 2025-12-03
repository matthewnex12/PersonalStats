import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Rect, Polyline, Text as SvgText } from 'react-native-svg';
import { MonthlySummary, YearlySummary } from '../models/stats';
import { typography } from '../theme';

interface Props {
  monthly?: MonthlySummary;
  yearly?: YearlySummary;
}

const palette = {
  surface: '#0a0f1c',
  card: '#11182b',
  accent: '#7c3aed',
  calm: '#38bdf8',
  sun: '#facc15',
  mint: '#22d3ee',
  pink: '#f472b6',
  text: '#e2e8f0',
  muted: '#94a3b8',
  divider: 'rgba(124, 58, 237, 0.4)',
};

const typography = {
  heading: {
    fontSize: 20,
    fontWeight: '800' as const,
    letterSpacing: 0.6,
  },
  subhead: {
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
  },
  body: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
};

export const SummaryPane: React.FC<Props> = ({ monthly, yearly }) => {
  const monthlyBars = useMemo(() => {
    if (!monthly) return [];
    return [
      { label: 'Workouts', value: monthly.totalWorkouts, color: palette.accent },
      { label: 'Sleep (hrs)', value: Math.round(monthly.totalSleepMinutes / 60), color: palette.calm },
      { label: 'Calories', value: monthly.totalCalories, color: palette.sun },
      { label: 'Gaming (m)', value: monthly.totalGamingMinutes, color: palette.pink },
    ];
  }, [monthly]);

  const yearlyWorkouts = useMemo(() => {
    if (!yearly) return [];
    return yearly.months.map((m) => m.totalWorkouts);
  }, [yearly]);

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

function StatBadge({
  label,
  value,
  tone,
  compact,
}: {
  label: string;
  value: string | number;
  tone: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.badge, compact && styles.badgeCompact, { borderColor: tone, shadowColor: tone }]}> 
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={[styles.badgeValue, { color: tone }]}>{value}</Text>
    </View>
  );
}

function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  if (!data.length) return null;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 70;
  const barWidth = 30;
  const gap = 18;
  const width = data.length * (barWidth + gap) + gap;

  return (
    <Svg height={chartHeight + 20} width={width}>
      {data.map((d, idx) => {
        const scaled = (d.value / maxValue) * chartHeight;
        const x = gap + idx * (barWidth + gap);
        const y = chartHeight - scaled;
        return (
          <React.Fragment key={d.label}>
            <Rect x={x} y={y} width={barWidth} height={scaled} rx={10} fill={d.color} opacity={0.9} />
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight + 16}
              fill={palette.muted}
              fontSize={10}
              fontWeight="700"
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const height = 70;
  const width = 260;
  const maxValue = Math.max(...data, 1);
  const step = width / Math.max(data.length - 1, 1);

  const points = data
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / maxValue) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg height={height} width={width}>
      <Polyline points={points} fill="none" stroke={palette.calm} strokeWidth={3} />
      <Polyline
        points={`0,${height} ${width},${height}`}
        fill="none"
        stroke={palette.divider}
        strokeWidth={1}
        strokeDasharray="6 4"
      />
    </Svg>
  );
}

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
