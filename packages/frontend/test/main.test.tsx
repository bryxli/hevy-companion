// @vitest-environment jsdom
import "./setupTests";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/App.tsx", () => ({
  default: () => <div data-testid="mock-app">Mock App</div>,
}));

const mockCreateClient = vi.fn().mockReturnValue({});
vi.mock("../src/trpc", () => ({
  trpc: {
    createClient: (opts: unknown) => mockCreateClient(opts),
    Provider: ({ children }: { children: ReactNode }) => (
      <div data-testid="trpc-provider">{children}</div>
    ),
  },
}));

vi.mock("@trpc/client", () => ({
  httpBatchLink: (opts: unknown) => ({
    _isMockedLink: true,
    ...(opts as Record<string, unknown>),
  }),
}));

describe("main.tsx (Application Entry Point)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    document.body.innerHTML = '<div id="root"></div>';

    localStorage.clear();
    vi.stubEnv("VITE_API_URL", "https://test.api.com/trpc");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("mounts the React app into the DOM", async () => {
    await import("../src/main");

    await waitFor(() => {
      const rootElement = document.getElementById("root");
      expect(rootElement?.innerHTML).toContain("mock-app");
      expect(rootElement?.innerHTML).toContain("trpc-provider");
    });
  });

  it("configures tRPC with the correct API URL and attaches the API key from localStorage", async () => {
    localStorage.setItem("hevy-api-key", "my-secret-key-123");

    await import("../src/main");

    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalled();
    });

    const clientConfig = mockCreateClient.mock.calls[0][0] as {
      links: Array<{
        _isMockedLink: boolean;
        url: string;
        headers: () => Record<string, string>;
      }>;
    };
    const linkConfig = clientConfig.links[0];

    expect(linkConfig._isMockedLink).toBe(true);
    expect(linkConfig.url).toBe("https://test.api.com/trpc");

    const headers = linkConfig.headers();
    expect(headers).toEqual({ "api-key": "my-secret-key-123" });
  });

  it("returns an empty headers object if no API key is in localStorage", async () => {
    await import("../src/main");

    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalled();
    });

    const clientConfig = mockCreateClient.mock.calls[0][0] as {
      links: Array<{ headers: () => Record<string, string> }>;
    };
    const linkConfig = clientConfig.links[0];

    const headers = linkConfig.headers();
    expect(headers).toEqual({});
  });
});
