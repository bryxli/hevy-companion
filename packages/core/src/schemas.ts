import { z } from "zod";

export const HevyUserInfo = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

export const HevySet = z.object({
  index: z.number(),
  type: z.string(),
  weight_kg: z.number().nullable(),
  reps: z.number().nullable(),
  distance_meters: z.number().nullable(),
  duration_seconds: z.number().nullable(),
  rpe: z.number().nullable(),
  custom_metrics: z.number().nullable(),
});

export const HevyExercise = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  supersets_id: z.number().nullable(),
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
