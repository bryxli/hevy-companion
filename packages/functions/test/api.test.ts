import { describe, it, expect } from "vitest";
import { appRouter } from "../src/api";
import { tInstance } from "../src/trpc";

describe("App Router", () => {
  const createCaller = tInstance.createCallerFactory(appRouter);

  it("should return ok status and a valid ISO timestamp on the health endpoint", async () => {
    const caller = createCaller({ apiKey: undefined });

    const result = await caller.health();

    expect(result.status).toBe("ok");

    expect(typeof result.timestamp).toBe("string");

    const parsedDate = new Date(result.timestamp);
    expect(parsedDate.getTime()).not.toBeNaN();
  });
});
