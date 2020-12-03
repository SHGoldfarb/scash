import React from "react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { DateTime } from "luxon";
import { repeat, asyncReduce, transactionsTotals, moneyFormat } from "utils";
import App from "./App";
import {
  mockTable,
  transactionMock,
  categoryMock,
  accountMock,
} from "./test-utils/mocks";
import { makeEventsPoint } from "./test-utils";

jest.mock("dexie", () => {
  return function Dexie() {
    return {
      version: () => ({ stores: () => {}, upgrade: () => {} }),
      table: (tableName) => mockTable(tableName),
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

  it("higlights transactions button", async () => {
    await runUserActions();

    expect(wrapper.getByText("Transactions").className).toEqual(
      expect.stringContaining("Mui-selected")
    );

    // Avoid missing act() warning
    await waitFor(() => {});
  });

  describe("database has transactions", () => {
    let transactionsThisMonth;
    let transactionsPrevMonth;

    beforeEach(() => {
      const startOfMonth = DateTime.local().startOf("month");

      // some transactions this month, some transactions previous month
      transactionsThisMonth = repeat(transactionMock, 4).map(
        (transaction, idx) => ({
          ...transaction,
          date: startOfMonth.plus({ days: idx }).toSeconds(),
        })
      );

      transactionsPrevMonth = repeat(transactionMock, 4).map(
        (transaction, idx) => ({
          ...transaction,
          date: startOfMonth
            .minus({ months: 1 })
            .plus({ days: idx })
            .toSeconds(),
        })
      );

      mockTable("transactions").set([
        ...transactionsThisMonth,
        ...transactionsPrevMonth,
      ]);
    });

    const expectTransactionInList = async (transaction) => {
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
    };

    const expectTransactionsInList = async (transactions) => {
      await asyncReduce(
        transactions.map((transaction) => async () => {
          await expectTransactionInList(transaction);
        })
      );
    };

    it("shows transactions list for current month", async () => {
      await runUserActions();

      // Avoid missing act() warning
      await waitFor(() => {});

      await expectTransactionsInList(transactionsThisMonth);

      // Make sure it does not show transactions from previous month
      transactionsPrevMonth.forEach((transaction) => {
        expect(wrapper.queryByText(transaction.comment, { exact: false })).toBe(
          null
        );
      });
    });

    it("shows total income/expense for month", async () => {
      const { income, expense } = transactionsTotals(transactionsThisMonth);

      await runUserActions();

      await wrapper.findByText(`${moneyFormat(income)}`);
      await wrapper.findByText(`${moneyFormat(expense)}`);
    });

    describe("user selects past month", () => {
      // Select previous month
      userAction(async () => {
        // Click on month field to open month dialog
        const currentDate = DateTime.local();
        const monthInput = await wrapper.findByDisplayValue(
          `${currentDate.monthLong} ${currentDate.year}`
        );
        fireEvent.click(monthInput);

        // On the dialog, select the previous month
        const dialogWrapper = await wrapper.findByRole("presentation");
        const previousMonthDate = currentDate
          .startOf("month")
          .minus({ months: 1 });
        fireEvent.click(
          // Select year
          within(dialogWrapper)
            .getAllByText(`${previousMonthDate.year}`)
            .slice(-1) // Last of the array
            .pop()
        );
        fireEvent.click(
          // Select month
          within(dialogWrapper).getByText(`${previousMonthDate.monthShort}`)
        );
      });

      it("shows transactions list for selected month", async () => {
        await runUserActions();

        // Avoid missing act() warning
        await waitFor(() => {});

        await expectTransactionsInList(transactionsPrevMonth);

        // Make sure it does not show transactions from current month
        transactionsThisMonth.forEach((transaction) => {
          expect(
            wrapper.queryByText(transaction.comment, { exact: false })
          ).toBe(null);
        });
      });

      describe("user presses new transactions button", () => {
        it.todo(
          "default date in transactions form is the last day of selected month"
        );
      });
    });

    describe("user selects future month", () => {
      describe("user presses new transactions button", () => {
        it.todo(
          "default date in transactions form is the first day of selected month"
        );
      });
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

    describe("user presses the new account button", () => {
      userAction(async () => {
        const createButton = wrapper.baseElement.querySelectorAll(
          "[aria-label='Create']"
        )[0];

        fireEvent.click(createButton);
      });

      it("auto focuses on new field", async () => {
        await runUserActions();
        const accountInput = wrapper.baseElement.querySelector("input");
        expect(document.activeElement).toEqual(accountInput);
      });

      describe("user writes name and saves", () => {
        const newAccountName = "New Account Name";

        userAction(async () => {
          const accountInput = wrapper.baseElement.querySelector("input");

          fireEvent.change(accountInput, { target: { value: newAccountName } });

          fireEvent.click(
            wrapper.baseElement.querySelector("[aria-label='save']")
          );
        });

        it("new account name is shown", async () => {
          await runUserActions();

          await wrapper.findByText(newAccountName);
        });
      });
    });

    describe("database has categories and accounts", () => {
      const categories = repeat(categoryMock, 2);
      const accounts = repeat(accountMock, 2);

      beforeEach(() => {
        mockTable("categories").set(categories);
        mockTable("accounts").set(accounts);
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
