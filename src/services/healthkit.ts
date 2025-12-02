import AppleHealthKit, { HealthKitPermissions, HealthValue, HKWorkoutTypeIdentifier } from 'react-native-health';
import { WorkoutEntry, SleepEntry, HeartRateSample, MuscleGroup } from '../models/stats';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      'HeartRate',
      'SleepAnalysis',
      'Workout',
      'DistanceCycling',
      'DistanceSwimming',
      'DistanceWalkingRunning',
    ],
    write: [],
  },
};

export async function requestHealthKitPermissions(): Promise<void> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function workoutMuscleGroups(type?: HKWorkoutTypeIdentifier): MuscleGroup[] {
  switch (type) {
    case 'HKWorkoutActivityTypeFunctionalStrengthTraining':
      return ['full-body'];
    case 'HKWorkoutActivityTypeCycling':
      return ['legs'];
    case 'HKWorkoutActivityTypeWalking':
    case 'HKWorkoutActivityTypeRunning':
      return ['legs', 'core'];
    case 'HKWorkoutActivityTypeSwimming':
      return ['full-body'];
    default:
      return ['full-body'];
  }
}

export async function fetchHealthKitWorkouts(startDate: string, endDate: string): Promise<WorkoutEntry[]> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getSamples(
      {
        startDate,
        endDate,
        type: 'Workout',
      },
      (err: Error | undefined, samples: HealthValue[]) => {
        if (err) {
          reject(err);
          return;
        }

        const workouts: WorkoutEntry[] = samples.map((sample) => ({
          id: String(sample.id),
          type: 'strength',
          muscleGroups: workoutMuscleGroups(sample.metadata?.HKWorkoutActivityType as HKWorkoutTypeIdentifier),
          durationMinutes: sample.duration ? sample.duration / 60 : 0,
          caloriesBurned: sample.calories,
          averageHeartRate: sample.metadata?.averageHeartRate,
          timestamp: sample.startDate,
          source: 'apple-health',
        }));
        resolve(workouts);
      },
    );
  });
}

export async function fetchHealthKitSleep(startDate: string, endDate: string): Promise<SleepEntry[]> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getSleepSamples({ startDate, endDate }, (err, samples) => {
      if (err) {
        reject(err);
        return;
      }
      const sleep: SleepEntry[] = samples.map((sample) => ({
        id: String(sample.id),
        durationMinutes: (new Date(sample.endDate).getTime() - new Date(sample.startDate).getTime()) / 60000,
        quality: 'good',
        start: sample.startDate,
        end: sample.endDate,
        source: 'apple-health',
      }));
      resolve(sleep);
    });
  });
}

export async function fetchHeartRate(startDate: string, endDate: string): Promise<HeartRateSample[]> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getHeartRateSamples({ startDate, endDate }, (err, samples) => {
      if (err) {
        reject(err);
        return;
      }
      const readings: HeartRateSample[] = samples.map((sample) => ({
        bpm: sample.value,
        timestamp: sample.startDate,
      }));
      resolve(readings);
    });
  });
}
