import { TRPCError } from "@trpc/server";
import { router, hevyProcedure } from "../trpc";
import {
  fetchWorkoutHistory,
  WorkoutHistoryInputSchema,
} from "@hevy-companion/core";

export const workoutsRouter = router({
  history: hevyProcedure
    .input(WorkoutHistoryInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const historyData = await fetchWorkoutHistory(ctx.apiKey, input?.limit);
        return historyData.workouts;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: errorMessage,
        });
      }
    }),
});
