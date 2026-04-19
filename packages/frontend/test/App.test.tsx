// @vitest-environment jsdom
import "./setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import App from "../src/App";
import { useAuthStore } from "../src/store/useAuthStore";

vi.mock("../src/components/ApiKeyForm", () => ({
  ApiKeyForm: () => <div data-testid="api-key-form">Mock Api Key Form</div>,
}));
vi.mock("../src/components/Header", () => ({
  Header: () => <div data-testid="header">Mock Header</div>,
}));
vi.mock("../src/components/UserProfile", () => ({
  UserProfile: () => <div data-testid="user-profile">Mock User Profile</div>,
}));
vi.mock("../src/components/WorkoutHistory", () => ({
  WorkoutHistory: () => (
    <div data-testid="workout-history">Mock Workout History</div>
  ),
}));

describe("App Component", () => {
  beforeEach(() => {
    useAuthStore.setState({ apiKey: null });
    vi.clearAllMocks();
  });

  it("renders the ApiKeyForm when no API key is present in the store", () => {
    render(<App />);

    expect(screen.getByTestId("api-key-form")).toBeInTheDocument();
    expect(screen.queryByTestId("header")).not.toBeInTheDocument();
  });

  it("renders the Header, UserProfile, and WorkoutHistory when API key exists", () => {
    useAuthStore.setState({ apiKey: "valid-key" });
    render(<App />);

    expect(screen.queryByTestId("api-key-form")).not.toBeInTheDocument();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    expect(screen.getByTestId("workout-history")).toBeInTheDocument();
  });
});
