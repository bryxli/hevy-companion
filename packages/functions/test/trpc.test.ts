import { describe, it, expect } from "vitest";
import { createContext, tInstance } from "../src/trpc";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";

describe("tRPC Configuration", () => {
  describe("createContext", () => {
    it("should extract the apiKey from the 'authorization' header (Bearer token)", () => {
      const mockEvent = {
        headers: {
          authorization: "Bearer secret-bearer-token",
        },
      } as unknown as APIGatewayProxyEventV2;

      const mockOptions = {
        event: mockEvent,
      } as CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>;
      const ctx = createContext(mockOptions);

      expect(ctx.apiKey).toBe("secret-bearer-token");
    });

    it("should extract the apiKey from the custom 'api-key' header", () => {
      const mockEvent = {
        headers: {
          "api-key": "secret-custom-key",
        },
      } as unknown as APIGatewayProxyEventV2;

      const mockOptions = {
        event: mockEvent,
      } as CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>;
      const ctx = createContext(mockOptions);

      expect(ctx.apiKey).toBe("secret-custom-key");
    });

    it("should return undefined for the apiKey if no valid headers exist", () => {
      const mockEvent = {
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const mockOptions = {
        event: mockEvent,
      } as CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>;
      const ctx = createContext(mockOptions);

      expect(ctx.apiKey).toBeUndefined();
    });
  });

  describe("errorFormatter", () => {
    it("should remove the stack trace from the error response to prevent leaking backend paths", () => {
      const dummyShape = {
        message: "Missing Hevy API Key in headers",
        code: -32001,
        data: {
          code: "UNAUTHORIZED",
          httpStatus: 401,
          stack: "stack trace",
          path: "user.info",
        },
      };

      const formattedError = tInstance._config.errorFormatter({
        shape: dummyShape,
      } as unknown as Parameters<typeof tInstance._config.errorFormatter>[0]);

      expect(formattedError.data.stack).toBeUndefined();

      expect(formattedError.message).toBe("Missing Hevy API Key in headers");
      expect(formattedError.data.code).toBe("UNAUTHORIZED");
    });
  });
});
