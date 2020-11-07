import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { DateTime } from "luxon";
import { repeat, upsertById } from "utils";
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
    type: "expense",
  };
};

const categoryMock = () => {
  const id = newId();
  return {
    id,
    name: `Category${id}`,
  };
};

const accountMock = () => {
  const id = newId();
  return {
    id,
    name: `Account${id}`,
  };
};

let mockDatabase;
beforeEach(() => {
  mockDatabase = {};
});

const mockPut = (tableName) =>
  jest.fn(async (item) => {
    if (!mockDatabase[tableName]) {
      mockDatabase[tableName] = [];
    }
    const safeId = item.id || newId();
    mockDatabase[tableName] = upsertById(mockDatabase[tableName], {
      ...item,
      id: safeId,
    });

    return safeId;
  });

const mockGet = (tableName) =>
  jest.fn(
    async ({ id }) =>
      mockDatabase[tableName].filter(
        ({ id: existingId }) => existingId === id
      )[0]
  );

jest.mock("dexie", () => {
  return function Dexie() {
    return {
      version: () => ({ stores: () => {}, upgrade: () => {} }),
      table: (tableName) => ({
        toArray: async () => mockDatabase[tableName] || [],
        put: mockPut(tableName),
        get: mockGet(tableName),
      }),
    };
  };
});

describe("App", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = undefined;
  });

  const [userAction, runUserActions] = makeEventsPoint();

  userAction(() => {
    wrapper = render(<App />);
  });

  describe("database has transactions", () => {
    let transactions;

    beforeEach(() => {
      transactions = repeat(transactionMock, 2);
      mockDatabase.transactions = transactions;
    });

    it("shows transactions list", async () => {
      await runUserActions();

      // Avoid missing act() warning
      await waitFor(() => {});

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
    userAction(async () => {
      // Avoid missing act() warning
      await waitFor(() => {});

      fireEvent.click(wrapper.getByText("New Transaction"));
    });
    describe("user enters transaction fields", () => {
      const newTransaction = transactionMock();
      newTransaction.type = "transfer";

      userAction(() => {
        // Enter type
        fireEvent.change(wrapper.getByLabelText("Type"), {
          target: { value: newTransaction.type },
        });

        // Enter amount
        fireEvent.change(wrapper.getByLabelText("Amount", { exact: false }), {
          target: { value: newTransaction.amount },
        });

        // Enter date
        // TODO: this not working
        fireEvent.change(wrapper.getByLabelText("Date"), {
          target: {
            value: DateTime.fromSeconds(newTransaction.date).toFormat(
              "yyyy-MM-dd HH:mm"
            ),
          },
        });

        // Enter comment
        fireEvent.change(wrapper.getByLabelText("Comment"), {
          target: {
            value: newTransaction.comment,
          },
        });
      });

      describe("user presses save button", () => {
        userAction(() => {
          fireEvent.click(wrapper.getByText("Save"));
        });

        it("displays new transaction", async () => {
          await runUserActions();

          // First ensure we went back to the transactions list by looking for the new transaction button
          await wrapper.findByText("New Transaction");

          // Look for new transaction attributes
          // comment
          await wrapper.findByText(newTransaction.comment, { exact: false });
          // amount
          await wrapper.findByText(`${newTransaction.amount}`, {
            exact: false,
          });
          // TODO: date
          // await wrapper.findByText(
          //   DateTime.fromSeconds(newTransaction.date).toLocaleString(
          //     DateTime.DATETIME_MED
          //   ),
          //   { exact: false }
          // );
        });
      });
    });
  });

  describe("user presses settings button", () => {
    userAction(async () => {
      fireEvent.click(wrapper.getByText("Settings"));

      // Avoid act() warning
      await waitFor(() => {});
    });

    describe("database has categories and accounts", () => {
      const categories = repeat(categoryMock, 2);
      const accounts = repeat(accountMock, 2);

      beforeEach(() => {
        mockDatabase.categories = categories;
        mockDatabase.accounts = accounts;
      });

      it("shows categories and accounts", async () => {
        await runUserActions();

        await asyncReduce(
          categories.map((category) => async () => {
            await wrapper.findByText(category.name);
          })
        );

        await asyncReduce(
          accounts.map((account) => async () => {
            await wrapper.findByText(account.name);
          })
        );
      });
    });
    describe("user presses transactions button", () => {
      userAction(async () => {
        fireEvent.click(wrapper.getByText("Transactions"));

        // Avoid act() warning
        await waitFor(() => {});
      });

      it("shows new transaction button", async () => {
        await runUserActions();

        wrapper.getByText("New Transaction");
      });
    });
  });
});
