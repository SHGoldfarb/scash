import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("dexie", () => {
  return function Dexie() {
    return {
      version: () => ({ stores: () => {}, upgrade: () => {} }),
      table: () => ({ toArray: async () => [] }),
    };
  };
});

describe("App", () => {
  it("redirects to the transactions page", async () => {
    const wrapper = render(<App />);

    // Test it redirects to transactions page by testing that the new transactions button is rendered
    wrapper.getByText("New Transaction");

    // wait to avoid missing act() warning
    await waitFor(() => {});
  });
});
