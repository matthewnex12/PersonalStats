export type WorkoutType =
  | 'strength'
  | 'cardio'
  | 'hiit'
  | 'mobility'
  | 'sport'
  | 'other';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'legs'
  | 'glutes'
  | 'full-body';

export interface WorkoutEntry {
  id: string;
  type: WorkoutType;
  muscleGroups: MuscleGroup[];
  durationMinutes: number;
  caloriesBurned?: number;
  averageHeartRate?: number;
  timestamp: string;
  source: 'manual' | 'apple-health' | 'discord-game';
}

export interface SleepEntry {
  id: string;
  durationMinutes: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  start: string;
  end: string;
  source: 'manual' | 'apple-health';
}

export interface MealEntry {
  id: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  description?: string;
  timestamp: string;
}

export interface WorkEntry {
  id: string;
  type: 'work' | 'homework';
  durationMinutes: number;
  description?: string;
  timestamp: string;
}

export interface SocialEntry {
  id: string;
  description: string;
  durationMinutes?: number;
  timestamp: string;
}

export interface GameSession {
  id: string;
  platform: 'discord' | 'manual';
  title: string;
  durationMinutes: number;
  timestamp: string;
  guildName?: string;
}

export interface HeartRateSample {
  bpm: number;
  timestamp: string;
}

export interface DailyStats {
  date: string;
  sleep: SleepEntry[];
  workouts: WorkoutEntry[];
  meals: MealEntry[];
  work: WorkEntry[];
  social: SocialEntry[];
  gaming: GameSession[];
  heartRate: HeartRateSample[];
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalWorkouts: number;
  totalWorkoutMinutes: number;
  totalSleepMinutes: number;
  averageSleepQuality: number;
  totalCalories: number;
  totalWorkMinutes: number;
  totalSocialEvents: number;
  totalGamingMinutes: number;
}

export interface YearlySummary {
  year: string; // YYYY
  months: MonthlySummary[];
}
