import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@hevy-companion/functions/src/api";

export const trpc = createTRPCReact<AppRouter>();
