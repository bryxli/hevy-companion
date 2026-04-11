import { TRPCError } from "@trpc/server";
import { router, hevyProcedure } from "../trpc";
import { fetchUserInfo } from "@hevy-companion/core";

export const userRouter = router({
  info: hevyProcedure.query(async ({ ctx }) => {
    try {
      const userData = await fetchUserInfo(ctx.apiKey);
      return userData.data;
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
