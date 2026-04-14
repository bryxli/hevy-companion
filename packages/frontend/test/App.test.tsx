// @vitest-environment jsdom
import "./setupTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import App from "../src/App";
import { trpc } from "../src/trpc";

vi.mock("../src/trpc", () => ({
  trpc: {
    user: {
      info: {
        useQuery: vi.fn(),
      },
    },
  },
}));

describe("App Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn() },
    });

    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    vi.clearAllMocks();
  });

  it("renders the login screen when no API key is present", () => {
    render(<App />);

    expect(
      screen.getByText("Please enter your Hevy Developer API Key to continue:"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter API Key...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Key" }),
    ).toBeInTheDocument();
  });

  it("saves the API key to localStorage and reloads the page", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText("Enter API Key...");
    const saveButton = screen.getByRole("button", { name: "Save Key" });

    await user.type(input, "test-api-key-123");
    await user.click(saveButton);

    expect(localStorage.getItem("hevy-api-key")).toBe("test-api-key-123");
    expect(window.location.reload).toHaveBeenCalledOnce();
  });

  it("renders the dashboard when an API key exists in localStorage", () => {
    localStorage.setItem("hevy-api-key", "existing-key");
    render(<App />);

    expect(screen.getByText("Hevy Profile Info")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Disconnect Key" }),
    ).toBeInTheDocument();
  });

  it("removes the API key and reloads when disconnect is clicked", async () => {
    const user = userEvent.setup();
    localStorage.setItem("hevy-api-key", "existing-key");
    render(<App />);

    const disconnectButton = screen.getByRole("button", {
      name: "Disconnect Key",
    });
    await user.click(disconnectButton);

    expect(localStorage.getItem("hevy-api-key")).toBeNull();
    expect(window.location.reload).toHaveBeenCalledOnce();
  });

  it("does not save or reload if the input is empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    const saveButton = screen.getByRole("button", { name: "Save Key" });
    await user.click(saveButton);

    expect(localStorage.getItem("hevy-api-key")).toBeNull();
    expect(globalThis.location.reload).not.toHaveBeenCalled();
  });

  it("displays loading state when fetching profile", () => {
    localStorage.setItem("hevy-api-key", "existing-key");

    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<App />);
    expect(
      screen.getByText("Fetching profile from Hevy..."),
    ).toBeInTheDocument();
  });

  it("displays error state when the query fails", () => {
    localStorage.setItem("hevy-api-key", "existing-key");

    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Invalid API Key provided" },
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<App />);
    expect(
      screen.getByText("Error: Invalid API Key provided"),
    ).toBeInTheDocument();
  });

  it("displays profile data when connection is successful", () => {
    localStorage.setItem("hevy-api-key", "existing-key");

    const mockUserData = { username: "bryxli" };
    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockUserData,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<App />);

    expect(screen.getByText("Connected Successfully")).toBeInTheDocument();

    expect(screen.getByText(new RegExp("bryxli"))).toBeInTheDocument();
  });
});
