// @vitest-environment jsdom
import "../setupTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { Header } from "../../src/components/Header";
import { useAuthStore } from "../../src/store/useAuthStore";

describe("Header Component", () => {
  beforeEach(() => {
    useAuthStore.setState({ apiKey: "existing-key" });
  });

  it("removes the API key from the store when disconnect is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const disconnectButton = screen.getByRole("button", {
      name: "Disconnect Key",
    });
    await user.click(disconnectButton);

    expect(useAuthStore.getState().apiKey).toBeNull();
  });
});
