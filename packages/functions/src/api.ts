import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { router, procedure, createContext } from "./trpc";
import { userRouter } from "./routers/user";
import { workoutsRouter } from "./routers/workouts";

export const appRouter = router({
  health: procedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),
  user: userRouter,
  workouts: workoutsRouter,
});

export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
