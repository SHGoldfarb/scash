import React from "react";
import { render } from "@testing-library/react";
import { DateTime } from "luxon";
import App from "./App";

let mockDatabase;

jest.mock("dexie", () => {
  return function Dexie() {
    return {
      version: () => ({ stores: () => {}, upgrade: () => {} }),
      table: (tableName) => ({
        toArray: async () => mockDatabase[tableName] || [],
      }),
    };
  };
});

const asyncReduce = (asyncFunctions) =>
  asyncFunctions.reduce(
    async (previousPromise, asyncFunction) =>
      asyncFunction(await previousPromise),
    Promise.resolve(null)
  );

describe("App", () => {
  beforeEach(() => {
    mockDatabase = {};
  });

  describe("when database has transactions", () => {
    let transactions;

    beforeEach(() => {
      transactions = [
        {
          id: 1,
          comment: "Comment 1",
          date: DateTime.local().toSeconds(),
        },
        {
          id: 2,
          comment: "Comment 2",
          date: DateTime.local().toSeconds(),
        },
      ];
      mockDatabase.transactions = transactions;
    });

    it("shows transactions list", async () => {
      const wrapper = render(<App />);

      await asyncReduce(
        transactions.map((transaction) => async () => {
          await wrapper.findByText(transaction.comment, { exact: false });
          // TODO: other attributes
        })
      );
    });
  });
});
