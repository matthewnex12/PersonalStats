import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyStats, MonthlySummary, YearlySummary } from '../models/stats';

const DAILY_KEY_PREFIX = 'daily:';
const MONTHLY_KEY_PREFIX = 'monthly:';
const YEARLY_KEY_PREFIX = 'yearly:';

async function saveObject<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getObject<T>(key: string): Promise<T | undefined> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function saveDailyStats(stats: DailyStats): Promise<void> {
  await saveObject(`${DAILY_KEY_PREFIX}${stats.date}`, stats);
}

export async function loadDailyStats(date: string): Promise<DailyStats | undefined> {
  return getObject<DailyStats>(`${DAILY_KEY_PREFIX}${date}`);
}

export async function saveMonthlySummary(summary: MonthlySummary): Promise<void> {
  await saveObject(`${MONTHLY_KEY_PREFIX}${summary.month}`, summary);
}

export async function loadMonthlySummary(month: string): Promise<MonthlySummary | undefined> {
  return getObject<MonthlySummary>(`${MONTHLY_KEY_PREFIX}${month}`);
}

export async function saveYearlySummary(summary: YearlySummary): Promise<void> {
  await saveObject(`${YEARLY_KEY_PREFIX}${summary.year}`, summary);
}

export async function loadYearlySummary(year: string): Promise<YearlySummary | undefined> {
  return getObject<YearlySummary>(`${YEARLY_KEY_PREFIX}${year}`);
}

export function mergeUniqueBy<T>(
  existing: T[],
  incoming: T[] | undefined,
  keySelector: (item: T) => string,
): T[] {
  const merged = new Map<string, T>();

  existing.forEach((item) => merged.set(keySelector(item), item));
  incoming?.forEach((item) => merged.set(keySelector(item), item));

  return Array.from(merged.values());
}

export async function mergeDailyStats(date: string, partial: Partial<DailyStats>): Promise<DailyStats> {
  const existing = (await loadDailyStats(date)) ?? {
    date,
    sleep: [],
    workouts: [],
    meals: [],
    work: [],
    social: [],
    gaming: [],
    heartRate: [],
  };

  const merged: DailyStats = {
    ...existing,
    ...partial,
    sleep: mergeUniqueBy(existing.sleep, partial.sleep, (item) => item.id),
    workouts: mergeUniqueBy(existing.workouts, partial.workouts, (item) => item.id),
    meals: mergeUniqueBy(existing.meals, partial.meals, (item) => item.id),
    work: mergeUniqueBy(existing.work, partial.work, (item) => item.id),
    social: mergeUniqueBy(existing.social, partial.social, (item) => item.id),
    gaming: mergeUniqueBy(existing.gaming, partial.gaming, (item) => item.id),
    heartRate: mergeUniqueBy(existing.heartRate, partial.heartRate, (item) => item.timestamp),
  };
  await saveDailyStats(merged);
  return merged;
}

export async function clearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const scoped = keys.filter(
    (key) =>
      key.startsWith(DAILY_KEY_PREFIX) || key.startsWith(MONTHLY_KEY_PREFIX) || key.startsWith(YEARLY_KEY_PREFIX),
  );
  await AsyncStorage.multiRemove(scoped);
}
