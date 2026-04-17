// @vitest-environment jsdom
import "./setupTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import App from "../src/App";
import { trpc } from "../src/trpc";
import { useAuthStore } from "../src/store/useAuthStore";

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
  beforeEach(() => {
    useAuthStore.setState({ apiKey: null });

    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);
  });

  afterEach(() => {
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

  it("saves the API key to the store and renders dashboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText("Enter API Key...");
    const saveButton = screen.getByRole("button", { name: "Save Key" });

    await user.type(input, "test-api-key-123");
    await user.click(saveButton);

    expect(useAuthStore.getState().apiKey).toBe("test-api-key-123");
  });

  it("renders the dashboard when an API key exists in the store", () => {
    useAuthStore.setState({ apiKey: "existing-key" });
    render(<App />);

    expect(screen.getByText("Hevy Profile Info")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Disconnect Key" }),
    ).toBeInTheDocument();
  });

  it("removes the API key when disconnect is clicked", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ apiKey: "existing-key" });
    render(<App />);

    const disconnectButton = screen.getByRole("button", {
      name: "Disconnect Key",
    });
    await user.click(disconnectButton);

    expect(useAuthStore.getState().apiKey).toBeNull();
  });

  it("does not save if the input is empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    const saveButton = screen.getByRole("button", { name: "Save Key" });
    await user.click(saveButton);

    expect(useAuthStore.getState().apiKey).toBeNull();
  });

  it("displays loading state when fetching profile", () => {
    useAuthStore.setState({ apiKey: "existing-key" });

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
    useAuthStore.setState({ apiKey: "existing-key" });

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
    useAuthStore.setState({ apiKey: "existing-key" });

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
