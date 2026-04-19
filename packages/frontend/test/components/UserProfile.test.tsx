// @vitest-environment jsdom
import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserProfile } from "../../src/components/UserProfile";
import { trpc } from "../../src/trpc";

vi.mock("../../src/trpc", () => ({
  trpc: {
    user: { info: { useQuery: vi.fn() } },
  },
}));

describe("UserProfile Component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("displays loading state", () => {
    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<UserProfile />);
    expect(
      screen.getByText("Fetching profile from Hevy..."),
    ).toBeInTheDocument();
  });

  it("displays error state", () => {
    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Invalid Key" },
      data: undefined,
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<UserProfile />);
    expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
    expect(screen.getByText("Invalid Key")).toBeInTheDocument();
  });

  it("displays profile data", () => {
    vi.mocked(trpc.user.info.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { username: "bryxli" },
    } as unknown as ReturnType<typeof trpc.user.info.useQuery>);

    render(<UserProfile />);
    expect(screen.getByText("Connected Successfully")).toBeInTheDocument();
    expect(screen.getByText(/bryxli/)).toBeInTheDocument();
  });
});
