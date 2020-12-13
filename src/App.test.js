import React from "react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { DateTime } from "luxon";
import { repeat, asyncReduce, transactionsTotals, moneyFormat } from "utils";
import App from "./App";
import { mockTable } from "./test-utils/mocks";
import {
  transactionMock,
  categoryMock,
  accountMock,
} from "./test-utils/mocks/entities";
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

    // reset url
    window.history.pushState({}, "", "/");
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

  const pressNewTransanctionButton = async () => {
    fireEvent.click(await wrapper.findByText("New Transaction"));
  };

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

    const selectMonth = async (date) => {
      // Click on month field to open month dialog
      const currentDate = DateTime.local();
      const monthInput = await wrapper.findByDisplayValue(
        `${currentDate.monthLong} ${currentDate.year}`
      );
      fireEvent.click(monthInput);

      // On the dialog, select the year and month
      const dialogWrapper = await wrapper.findByRole("presentation");

      fireEvent.click(
        // Select year
        within(dialogWrapper)
          .getAllByText(`${date.year}`)
          .slice(-1) // Last of the array
          .pop()
      );
      fireEvent.click(
        // Select month
        within(dialogWrapper).getByText(`${date.monthShort}`)
      );
    };

    describe("user selects past month", () => {
      // Select previous month
      userAction(async () => {
        const previousMonthDate = DateTime.local()
          .startOf("month")
          .minus({ months: 1 });

        await selectMonth(previousMonthDate);
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
        userAction(async () => {
          await pressNewTransanctionButton();
        });

        it("default date in transactions form is the last day of selected month", async () => {
          await runUserActions();

          // Find that the date input has the correct default value
          await wrapper.findByDisplayValue(
            DateTime.local()
              .minus({ months: 1 })
              .endOf("month")
              .toFormat("yyyy-MM-dd HH:mm")
          );
        });
      });
    });

    describe("user selects future month", () => {
      // Select next month
      userAction(async () => {
        const nextMonthDate = DateTime.local()
          .startOf("month")
          .plus({ months: 1 });

        await selectMonth(nextMonthDate);
      });
      describe("user presses new transactions button", () => {
        userAction(async () => {
          await pressNewTransanctionButton();
        });

        it("default date in transactions form is the first day of selected month", async () => {
          await runUserActions();

          // Find that the date input has the correct default value
          await wrapper.findByDisplayValue(
            DateTime.local()
              .plus({ months: 1 })
              .startOf("month")
              .toFormat("yyyy-MM-dd HH:mm")
          );
        });
      });
    });
  });

  describe("user presses the new transaction button", () => {
    userAction(async () => {
      // Avoid missing act() warning
      await waitFor(() => {});

      await pressNewTransanctionButton();

      // Avoid missing act() warning
      await waitFor(() => {});
    });

    describe("database has accounts", () => {
      let accounts;
      beforeEach(async () => {
        mockTable("accounts").set(repeat(accountMock, 5));
        accounts = await mockTable("accounts").toArray();
      });

      describe("user creates an income transaction", () => {
        const createTransactionInForm = ({ type, accountName } = {}) => {
          const newTransaction = transactionMock();

          // Enter type
          fireEvent.change(wrapper.getByLabelText("Type"), {
            target: { value: type || newTransaction.type },
          });

          // Enter amount
          fireEvent.change(wrapper.getByLabelText("Amount", { exact: false }), {
            target: { value: newTransaction.amount },
          });

          // Enter account
          fireEvent.change(wrapper.getByLabelText("Account"), {
            target: { value: wrapper.getByText(accountName).value },
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

          fireEvent.click(wrapper.getByText("Save"));
        };

        let selectedAccount;
        userAction(() => {
          [selectedAccount] = accounts;

          createTransactionInForm({
            accountName: selectedAccount.name,
            type: "income",
          });
        });

        const expectToBeInTransactionsPage = async () => {
          // Test we are in transaction page by expecting the new transaction button to be shown
          await wrapper.findByText("New Transaction");
        };

        it("correctly assosiates transaction to account", async () => {
          await runUserActions();

          // Test the account was associated by looking for it in the transactions page
          // First make sure we are in transactions page
          await expectToBeInTransactionsPage();

          await wrapper.findByText(selectedAccount.name, { exact: false });
        });
      });

      describe("user creates an expense transaction", () => {
        it.todo("correctly assosiates transaction to account");
      });

      describe("user creates a transfer transaction", () => {
        it.todo("correctly assosiates transaction to account");
      });
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

    describe("there is an account with a noncero amount", () => {
      it.todo("does not let the user delte the account");
    });

    describe("user enters mock seed command", () => {
      userAction(async () => {
        const commandInput = await wrapper.findByLabelText("Command line");
        fireEvent.change(commandInput, { target: { value: "seed5000" } });
        fireEvent.focus(commandInput);
        fireEvent.keyPress(commandInput, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
      });

      it("populates everything", async () => {
        await runUserActions();

        // Shows the correct amount of list items
        await waitFor(() => {
          expect(wrapper.baseElement.querySelectorAll("li").length).toBe(15);
        });

        // This is not ideal test, since we must test from the user perspective and not peek into the database
        // TODO: test correctly
        expect((await mockTable("transactions").toArray()).length).toBe(5000);
      });
    });

    describe("user presses the new income category button", () => {
      userAction(async () => {
        const createButton = wrapper.baseElement.querySelectorAll(
          "[aria-label='Create']"
        )[2];

        fireEvent.click(createButton);
      });
      describe("user writes income category name and saves", () => {
        const newIncomeCategoryName = "this is an income category";

        userAction(async () => {
          const nameInput = wrapper.baseElement.querySelectorAll("input")[1];

          fireEvent.change(nameInput, {
            target: { value: newIncomeCategoryName },
          });

          fireEvent.click(
            wrapper.baseElement.querySelector("[aria-label='save']")
          );
        });

        it("adds the new income category to the list", async () => {
          await runUserActions();

          await wrapper.findByText(newIncomeCategoryName);
        });
      });
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
        const accountInput = wrapper.baseElement.querySelectorAll("input")[1];
        expect(document.activeElement).toEqual(accountInput);
      });

      describe("user writes name and saves", () => {
        const newAccountName = "New Account Name";

        userAction(async () => {
          const accountInput = wrapper.baseElement.querySelectorAll("input")[1];

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

      describe("database has some transactions", () => {
        it.todo("shows the amount in the account for each account");
      });
    });
    describe("user presses transactions button", () => {
      userAction(async () => {
        fireEvent.click(wrapper.getByText("Transactions"));

        // Avoid act() warning
        await waitFor(() => {});
      });

      it("goes to transactions page", async () => {
        await runUserActions();

        // Test it goes to transaction page by expecting the new transaction button to be shown
        wrapper.getByText("New Transaction");
      });
    });
  });
});
