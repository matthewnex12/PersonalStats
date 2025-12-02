import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Dashboard } from './components/Dashboard';
import { DailyStats, MonthlySummary, YearlySummary } from './models/stats';
import { loadDailyStats, loadMonthlySummary, loadYearlySummary, mergeDailyStats } from './storage/localDatabase';
import { configureBackgroundSync } from './services/sync';

const today = new Date().toISOString().slice(0, 10);
const emptyStats: DailyStats = {
  date: today,
  sleep: [],
  workouts: [],
  meals: [],
  work: [],
  social: [],
  gaming: [],
  heartRate: [],
};

export default function App() {
  const [stats, setStats] = useState<DailyStats>(emptyStats);
  const [monthly, setMonthly] = useState<MonthlySummary | undefined>();
  const [yearly, setYearly] = useState<YearlySummary | undefined>();

  useEffect(() => {
    async function bootstrap() {
      const [existing, monthlySummary, yearlySummary] = await Promise.all([
        loadDailyStats(today),
        loadMonthlySummary(today.slice(0, 7)),
        loadYearlySummary(today.slice(0, 4)),
      ]);
      setStats(existing ?? emptyStats);
      setMonthly(monthlySummary);
      setYearly(yearlySummary);
    }

    bootstrap();
    configureBackgroundSync({});
  }, []);

  const handleManualUpdate = async (partial: Partial<DailyStats>) => {
    const merged = await mergeDailyStats(today, partial);
    setStats(merged);
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <Dashboard stats={stats} monthly={monthly} yearly={yearly} onManualUpdate={handleManualUpdate} />
    </SafeAreaView>
  );
}
