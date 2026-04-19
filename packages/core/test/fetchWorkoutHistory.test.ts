import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { fetchWorkoutHistory } from "../src/hevy";
import { ZodError } from "zod";

globalThis.fetch = vi.fn();

describe("fetchWorkoutHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully parse a workout even if nullish fields are completely missing", async () => {
    const mockMissingFieldsResponse = {
      page: 1,
      page_count: 1,
      workouts: [
        {
          id: "workout_1",
          title: "Upper Body",
          routine_id: "routine_1",
          start_time: "2026-04-17T10:00:00Z",
          end_time: "2026-04-17T11:00:00Z",
          updated_at: "2026-04-17T11:00:00Z",
          created_at: "2026-04-17T10:00:00Z",
          exercises: [
            {
              index: 0,
              title: "Pull Up",
              exercise_template_id: "tpl_1",
              notes: "",
              sets: [
                {
                  index: 0,
                  type: "bodyweight",
                },
              ],
            },
          ],
        },
      ],
    };

    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMissingFieldsResponse,
    });

    const result = await fetchWorkoutHistory("valid-api-key", 1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.hevyapp.com/v1/workouts?pageSize=1",
      expect.objectContaining({
        headers: { "api-key": "valid-api-key" },
      }),
    );
    expect(result.workouts[0].title).toBe("Upper Body");

    expect(result.workouts[0].exercises[0].supersets_id).toBeUndefined();
    expect(result.workouts[0].exercises[0].sets[0].weight_kg).toBeUndefined();
  });

  it("should throw an error if the HTTP response is not ok", async () => {
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchWorkoutHistory("bad-key", 5)).rejects.toThrow(
      "Hevy API Error: 500 Internal Server Error",
    );
  });

  it("should throw a Zod validation error if REQUIRED fields are missing", async () => {
    const criticallyBadResponse = {
      page_count: 1,
      workouts: [
        {
          title: "Missing ID Workout",
        },
      ],
    };

    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => criticallyBadResponse,
    });

    await expect(fetchWorkoutHistory("valid-key", 1)).rejects.toThrow(ZodError);
  });
});
