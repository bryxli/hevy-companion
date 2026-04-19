// @vitest-environment jsdom
import "../setupTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkoutHistory } from "../../src/components/WorkoutHistory";
import { trpc } from "../../src/trpc";

vi.mock("../../src/trpc", () => ({
  trpc: {
    workouts: { history: { useQuery: vi.fn() } },
  },
}));

describe("WorkoutHistory Component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("displays loading state", () => {
    vi.mocked(trpc.workouts.history.useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof trpc.workouts.history.useQuery>);

    render(<WorkoutHistory />);
    expect(screen.getByText("Loading workouts...")).toBeInTheDocument();
  });

  it("displays error state", () => {
    vi.mocked(trpc.workouts.history.useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Invalid Key" },
      data: undefined,
    } as unknown as ReturnType<typeof trpc.workouts.history.useQuery>);

    render(<WorkoutHistory />);
    expect(screen.getByText("Failed to load workouts")).toBeInTheDocument();
    expect(screen.getByText("Invalid Key")).toBeInTheDocument();
  });

  it("renders fetched workouts correctly with exercises and sets", () => {
    vi.mocked(trpc.workouts.history.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          id: "1",
          title: "Leg Day",
          start_time: "2026-04-18T10:00:00Z",
          exercises: [
            {
              index: 0,
              title: "Barbell Squat",
              sets: [
                { index: 0, type: "normal" },
                { index: 1, type: "normal" },
                { index: 2, type: "normal" },
              ],
            },
          ],
        },
      ],
    } as unknown as ReturnType<typeof trpc.workouts.history.useQuery>);

    render(<WorkoutHistory />);

    expect(screen.getByText("Recent Workouts")).toBeInTheDocument();
    expect(screen.getByText("Leg Day")).toBeInTheDocument();
    expect(screen.getByText("Barbell Squat")).toBeInTheDocument();
    expect(screen.getByText("3 sets")).toBeInTheDocument();
  });

  it("updates the query limit when dropdown is changed", async () => {
    const user = userEvent.setup();
    vi.mocked(trpc.workouts.history.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof trpc.workouts.history.useQuery>);

    render(<WorkoutHistory />);

    expect(trpc.workouts.history.useQuery).toHaveBeenCalledWith({ limit: 3 });

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "10");

    expect(trpc.workouts.history.useQuery).toHaveBeenCalledWith({ limit: 10 });
  });
});
