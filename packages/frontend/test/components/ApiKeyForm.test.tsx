// @vitest-environment jsdom
import "../setupTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ApiKeyForm } from "../../src/components/ApiKeyForm";
import { useAuthStore } from "../../src/store/useAuthStore";

describe("ApiKeyForm Component", () => {
  beforeEach(() => {
    useAuthStore.setState({ apiKey: null });
  });

  it("renders the input and save button", () => {
    render(<ApiKeyForm />);
    expect(screen.getByPlaceholderText("Enter API Key...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Key" }),
    ).toBeInTheDocument();
  });

  it("saves the API key to the store when submitted", async () => {
    const user = userEvent.setup();
    render(<ApiKeyForm />);

    const input = screen.getByPlaceholderText("Enter API Key...");
    const saveButton = screen.getByRole("button", { name: "Save Key" });

    await user.type(input, "test-api-key-123");
    await user.click(saveButton);

    expect(useAuthStore.getState().apiKey).toBe("test-api-key-123");
  });

  it("does not save to the store if the input is empty", async () => {
    const user = userEvent.setup();
    render(<ApiKeyForm />);

    const saveButton = screen.getByRole("button", { name: "Save Key" });
    await user.click(saveButton);

    expect(useAuthStore.getState().apiKey).toBeNull();
  });
});
