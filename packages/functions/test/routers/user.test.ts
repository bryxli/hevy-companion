import { beforeEach, describe, it, expect, vi, type Mock } from "vitest";
import { TRPCError } from "@trpc/server";
import { fetchUserInfo } from "@hevy-companion/core";
import { appRouter } from "../../src/api";
import { tInstance } from "../../src/trpc";

vi.mock("@hevy-companion/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@hevy-companion/core")>();
  return {
    ...actual,
    fetchUserInfo: vi.fn(),
  };
});
describe("User Router", () => {
  const createCaller = tInstance.createCallerFactory(appRouter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the flattened user data when authenticated", async () => {
    (fetchUserInfo as Mock).mockResolvedValueOnce({
      data: {
        id: "123",
        name: "bryxli",
        url: "https://hevy.com/user/bryxli",
      },
    });

    const caller = createCaller({ apiKey: "valid-test-key" });
    const result = await caller.user.info();

    expect(fetchUserInfo).toHaveBeenCalledWith("valid-test-key");
    expect(result.name).toBe("bryxli");
    expect(result.id).toBe("123");
  });

  it("should throw an UNAUTHORIZED error if no API key is provided", async () => {
    const caller = createCaller({ apiKey: undefined });

    await expect(caller.user.info()).rejects.toThrow(TRPCError);
    await expect(caller.user.info()).rejects.toThrow(
      "Missing Hevy API Key in headers",
    );

    expect(fetchUserInfo).not.toHaveBeenCalled();
  });

  it("should throw an INTERNAL_SERVER_ERROR if the Hevy API fails", async () => {
    (fetchUserInfo as Mock).mockRejectedValueOnce(
      new Error("Hevy API Error: 401 Unauthorized"),
    );

    const caller = createCaller({ apiKey: "valid-test-key" });
    const responsePromise = caller.user.info();

    await expect(responsePromise).rejects.toThrow(TRPCError);
    await expect(responsePromise).rejects.toThrow(
      "Hevy API Error: 401 Unauthorized",
    );
  });

  it("should throw an INTERNAL_SERVER_ERROR if the Hevy API fails and a non-Error is thrown", async () => {
    (fetchUserInfo as Mock).mockRejectedValueOnce("non-Error rejection");

    const caller = createCaller({ apiKey: "valid-test-key" });
    const responsePromise = caller.user.info();

    await expect(responsePromise).rejects.toThrow(TRPCError);
    await expect(responsePromise).rejects.toThrow("An unknown error occurred");
  });
});
