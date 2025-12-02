# Personal Stats

A React Native starter for daily stats tracking that combines manual inputs with Apple HealthKit/Watch ingestion and Discord gaming activity.

## Features
- Data models for sleep, workouts (with muscle groups), meals/calories, work/homework, social events, gaming, and heart-rate samples.
- AsyncStorage-backed persistence for daily, monthly, and yearly summaries.
- HealthKit permission request helpers plus fetchers for workouts, sleep, and heart rate.
- Discord OAuth + API ingestion for game sessions.
- Dashboard UI with a body silhouette that highlights muscles worked, HP and sleep-energy bars, and swipeable panes for manual entry and summaries.
- Background sync hook using `react-native-background-fetch` to keep device data current.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure native modules for HealthKit and background fetch per the linked package docs.
3. Supply Discord OAuth credentials (`clientId`, `clientSecret`, `redirectUri`) when calling `exchangeDiscordCode` and pass the resulting token into `configureBackgroundSync`.
4. Launch the app with your React Native tooling (Metro/Expo) and grant Health permissions when prompted.
