import React from "react";
import { render } from "@testing-library/react";
import { DateTime } from "luxon";
import { repeat } from "utils";
import App from "./App";

const asyncReduce = (asyncFunctions) =>
  asyncFunctions.reduce(
    async (previousPromise, asyncFunction) =>
      asyncFunction(await previousPromise),
    Promise.resolve(null)
  );

const makeEventsPoint = () => {
  let events;

  beforeEach(() => {
    events = [];
  });

  const addEvent = (event) => {
    beforeEach(() => {
      events.push(event);
    });
  };

  const runEvents = () => asyncReduce(events);

  return [addEvent, runEvents];
};

let currentId = 0;
const newId = () => {
  currentId += 1;
  return currentId;
};

const transactionMock = () => {
  const id = newId();
  return {
    id,
    comment: `Comment${id} for ${id}`,
    date: 1604767791 + id * 60,
    amount: 5000 + id,
  };
};

let mockDatabase;

beforeEach(() => {
  mockDatabase = {};
});

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

describe("App", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = undefined;
  });

  const [addUserAction, runUserActions] = makeEventsPoint();

  addUserAction(() => {
    wrapper = render(<App />);
  });

  describe("database has transactions", () => {
    let transactions;

    beforeEach(() => {
      transactions = repeat(transactionMock, 2);
      mockDatabase.transactions = transactions;
    });

    it("shows transactions list", async () => {
      runUserActions();

      await asyncReduce(
        transactions.map((transaction) => async () => {
          // comment
          await wrapper.findByText(transaction.comment, { exact: false });
          // amount
          await wrapper.findByText(`${transaction.amount}`, { exact: false });
          // date
          await wrapper.findByText(
            DateTime.fromSeconds(transaction.date).toLocaleString(
              DateTime.DATETIME_MED
            ),
            { exact: false }
          );
        })
      );
    });
  });

  describe("user presses the new transaction button", () => {
    describe("user enters transaction fields", () => {
      describe("user presses save button", () => {
        it.todo("updates the database and the cache");
      });
    });
  });

  describe("user presses settings button", () => {
    describe("database has categories and accounts", () => {
      it.todo("shows categories and accounts");
    });
    describe("user presses transactions button", () => {
      describe("database has transactions", () => {
        it.todo("shows transactions");
      });
    });
  });
});
