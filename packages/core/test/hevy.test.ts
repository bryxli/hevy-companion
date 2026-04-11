import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { fetchUserInfo } from "../src/hevy";
import { ZodError } from "zod";

global.fetch = vi.fn();

describe("fetchUserInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return parsed user data on a successful response", async () => {
    const mockHevyResponse = {
      data: {
        id: "123",
        name: "bryxli",
        url: "https://hevy.com/user/bryxli",
      },
    };

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHevyResponse,
    });

    const result = await fetchUserInfo("valid-api-key");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.hevyapp.com/v1/user/info",
      expect.objectContaining({
        headers: { "api-key": "valid-api-key" },
      }),
    );
    expect(result.data.name).toBe("bryxli");
  });

  it("should throw an error if the HTTP response is not ok (e.g., 401)", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(fetchUserInfo("bad-key")).rejects.toThrow(
      "Hevy API Error: 401 Unauthorized",
    );
  });

  it("should throw a Zod validation error if Hevy changes their API payload", async () => {
    const badHevyResponse = {
      data: {
        id: "123",
      },
    };

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => badHevyResponse,
    });

    await expect(fetchUserInfo("valid-key")).rejects.toThrow(ZodError);
  });
});
