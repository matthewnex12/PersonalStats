import BackgroundFetch from 'react-native-background-fetch';
import { fetchDiscordGameSessions } from './discord';
import { fetchHealthKitSleep, fetchHealthKitWorkouts, fetchHeartRate, requestHealthKitPermissions } from './healthkit';
import { mergeDailyStats } from '../storage/localDatabase';
import { GameSession } from '../models/stats';

interface SyncConfig {
  discordToken?: string;
}

async function syncDiscord(token: string, date: string): Promise<void> {
  const sessions: GameSession[] = await fetchDiscordGameSessions(token);
  await mergeDailyStats(date, { gaming: sessions });
}

async function syncHealthKit(date: string): Promise<void> {
  await requestHealthKitPermissions();
  const startDate = new Date(date).toISOString();
  const endDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString();
  const [sleep, workouts, heartRate] = await Promise.all([
    fetchHealthKitSleep(startDate, endDate),
    fetchHealthKitWorkouts(startDate, endDate),
    fetchHeartRate(startDate, endDate),
  ]);
  await mergeDailyStats(date, { sleep, workouts, heartRate });
}

export async function configureBackgroundSync(config: SyncConfig): Promise<void> {
  await BackgroundFetch.configure(
    { minimumFetchInterval: 15, enableHeadless: true, startOnBoot: true },
    async (taskId) => {
      const date = new Date().toISOString().slice(0, 10);
      if (config.discordToken) {
        await syncDiscord(config.discordToken, date);
      }
      await syncHealthKit(date);
      BackgroundFetch.finish(taskId);
    },
    (error) => {
      console.warn('Background fetch failed to start', error);
    },
  );
}
