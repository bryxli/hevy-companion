import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

export function createContext({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  const authHeader = event.headers.authorization;
  const apiKey = authHeader?.split(" ")[1] || event.headers["api-key"];

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

export const router = t.router;
export const procedure = t.procedure;
export const hevyProcedure = t.procedure.use(isAuthed);
export const tInstance = t;
