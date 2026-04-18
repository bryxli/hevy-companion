import { z } from "zod";

export const HevyUserInfo = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

export const HevySet = z.object({
  index: z.number(),
  type: z.string(),
  weight_kg: z.number().nullish(),
  reps: z.number().nullish(),
  distance_meters: z.number().nullish(),
  duration_seconds: z.number().nullish(),
  rpe: z.number().nullish(),
  custom_metrics: z.number().nullish(),
});

export const HevyExercise = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  supersets_id: z.number().nullish(),
  sets: z.array(HevySet),
});

export const HevyWorkout = z.object({
  id: z.string(),
  title: z.string(),
  routine_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  exercises: z.array(HevyExercise),
});

export const HevyUserInfoResponse = z.object({
  data: HevyUserInfo,
});

export const HevyWorkoutHistoryResponse = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: z.array(HevyWorkout),
});

export const WorkoutHistoryInputSchema = z
  .object({
    limit: z.number().min(1).max(10).default(1),
  })
  .default({ limit: 1 });
