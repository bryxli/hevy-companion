import { initTRPC, TRPCError } from "@trpc/server";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

export function createContext({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  const authHeader = event.headers.authorization;
  const apiKey = authHeader?.split(" ")[1] || event.headers["x-api-key"];

  return { apiKey };
}
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack: undefined,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.apiKey) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing Hevy API Key in headers",
    });
  }
  return next({
    ctx: { apiKey: ctx.apiKey },
  });
});

const protectedProcedure = t.procedure.use(isAuthed);

const appRouter = t.router({
  health: t.procedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),
  testAuth: protectedProcedure.query(({ ctx }) => {
    const maskedKey = ctx.apiKey.slice(0, 4) + "..." + ctx.apiKey.slice(-4);
    return {
      message: "Authentication successful!",
      receivedKey: maskedKey,
    };
  }),
});

export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
