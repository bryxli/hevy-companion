import { beforeEach, describe, it, expect, vi, type Mock } from "vitest";
import { TRPCError } from "@trpc/server";
import { fetchWorkoutHistory } from "@hevy-companion/core";
import { appRouter } from "../../src/api";
import { tInstance } from "../../src/trpc";

vi.mock("@hevy-companion/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@hevy-companion/core")>();
  return {
    ...actual,
    fetchWorkoutHistory: vi.fn(),
  };
});

describe("Workouts Router", () => {
  const createCaller = tInstance.createCallerFactory(appRouter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the flattened workouts array when authenticated", async () => {
    const mockWorkoutsArray = [{ id: "workout_1", title: "Leg Day" }];
    (fetchWorkoutHistory as Mock).mockResolvedValueOnce({
      page: 1,
      page_count: 1,
      workouts: mockWorkoutsArray,
    });

    const caller = createCaller({ apiKey: "valid-test-key" });
    const result = await caller.workouts.history({ limit: 5 });

    expect(fetchWorkoutHistory).toHaveBeenCalledWith("valid-test-key", 5);
    expect(result).toEqual(mockWorkoutsArray);
    expect(result).not.toHaveProperty("page_count");
  });

  it("should apply the default limit of 1 if no input is provided", async () => {
    (fetchWorkoutHistory as Mock).mockResolvedValueOnce({
      page: 1,
      page_count: 1,
      workouts: [],
    });

    const caller = createCaller({ apiKey: "valid-test-key" });
    await caller.workouts.history();

    expect(fetchWorkoutHistory).toHaveBeenCalledWith("valid-test-key", 1);
  });

  it("should throw a Zod validation error if the limit exceeds 10", async () => {
    const caller = createCaller({ apiKey: "valid-test-key" });

    await expect(caller.workouts.history({ limit: 50 })).rejects.toThrow(
      /Too big/,
    );

    expect(fetchWorkoutHistory).not.toHaveBeenCalled();
  });

  it("should throw an UNAUTHORIZED error if no API key is provided", async () => {
    const caller = createCaller({ apiKey: undefined });

    await expect(caller.workouts.history()).rejects.toThrow(TRPCError);
    await expect(caller.workouts.history()).rejects.toThrow(
      "Missing Hevy API Key in headers",
    );
    expect(fetchWorkoutHistory).not.toHaveBeenCalled();
  });

  it("should throw an INTERNAL_SERVER_ERROR if the Hevy API fails", async () => {
    (fetchWorkoutHistory as Mock).mockRejectedValueOnce(
      new Error("Hevy API Error: 500 Internal Server Error"),
    );

    const caller = createCaller({ apiKey: "valid-test-key" });
    const responsePromise = caller.workouts.history();

    await expect(responsePromise).rejects.toThrow(TRPCError);
    await expect(responsePromise).rejects.toThrow(
      "Hevy API Error: 500 Internal Server Error",
    );
  });

  it("should throw an INTERNAL_SERVER_ERROR if the Hevy API fails and a non-Error is thrown", async () => {
    (fetchWorkoutHistory as Mock).mockRejectedValueOnce("non-Error rejection");

    const caller = createCaller({ apiKey: "valid-test-key" });
    const responsePromise = caller.workouts.history();

    await expect(responsePromise).rejects.toThrow(TRPCError);
    await expect(responsePromise).rejects.toThrow("An unknown error occurred");
  });
});
