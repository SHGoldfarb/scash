import React from "react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { DateTime } from "luxon";
import {
  repeat,
  asyncReduce,
  transactionsTotals,
  currencyFormat,
  getTransactionsStats,
} from "utils";
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

  describe("database has a single transaction and single account", () => {
    let transaction;
    let account;
    beforeEach(() => {
      const startOfMonth = DateTime.local().startOf("month");

      transaction = transactionMock({
        date: startOfMonth.toSeconds(),
        type: "expense",
      });

      account = accountMock({ id: transaction.accountId });

      mockTable("transactions").set([transaction]);
      mockTable("accounts").set([account]);
    });

    describe("user is in the transactions page and account name is rendered", () => {
      userAction(async () => {
        await expectTransactionInList(transaction);
        await wrapper.findByText(account.name, { exact: false });
      });

      describe("user goes to settings and updates the account name", () => {
        const newAccountName = "new-account-name";

        userAction(async () => {
          // Go to settings
          fireEvent.click(wrapper.getByText("Settings"));
          // Click in update icon
          fireEvent.click(await wrapper.findByTestId("edit"));

          // Change text
          fireEvent.change(await wrapper.findByDisplayValue(account.name), {
            target: { value: newAccountName },
          });

          // Click in save icon
          fireEvent.click(await wrapper.findByTestId("save"));
        });

        describe("user goes back to transactions page", () => {
          userAction(() => {
            fireEvent.click(wrapper.getByText("Transactions"));
          });

          it("shows new account name", async () => {
            await runUserActions();

            await wrapper.findByText(newAccountName, { exact: false });
          });
        });
      });
    });
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

      await wrapper.findByText(`${currencyFormat(income)}`);
      await wrapper.findByText(`${currencyFormat(expense)}`);
    });

    const selectMonth = async (date) => {
      // Click on month field to open month dialog
      const currentDate = DateTime.local();
      const monthInput = await wrapper.findByDisplayValue(
        `${currentDate.monthLong} ${currentDate.year}`
      );

      fireEvent.click(monthInput);

      // Identify the dialog
      const dialogWrapper = (await wrapper.findAllByRole("presentation"))[0];

      // Click on the pen icon to manually input date
      fireEvent.click(within(dialogWrapper).getByTestId("PenIcon"));

      // Input new date
      fireEvent.change(
        within(dialogWrapper).getByDisplayValue(
          `${currentDate.monthLong} ${currentDate.year}`
        ),
        {
          target: { value: `${date.monthLong} ${date.year}` },
        }
      );

      // Click OK
      fireEvent.click(within(dialogWrapper).getByText("OK"));
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

          // Avoid missing act() warning
          await waitFor(() => {});
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

          // Avoid missing act() warning
          await waitFor(() => {});
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

    const selectTransactionTypeInForm = (type) => {
      fireEvent.change(wrapper.getByLabelText("Type"), {
        target: { value: type },
      });
    };

    const createTransactionInForm = async ({
      type,
      accountName,
      originAccountName,
      destinationAccountName,
      amount,
      comment,
    } = {}) => {
      const newTransaction = transactionMock();

      // Enter type
      selectTransactionTypeInForm(type || newTransaction.type);

      // Enter amount
      fireEvent.change(wrapper.getByLabelText("Amount", { exact: false }), {
        target: { value: amount || newTransaction.amount },
      });

      if (accountName) {
        // Enter account
        fireEvent.change(wrapper.getByLabelText("Account"), {
          target: { value: wrapper.getByText(accountName).value },
        });
      }

      if (originAccountName) {
        // Enter account
        const originAccountInput = wrapper.getByLabelText("Origin Account");
        fireEvent.change(originAccountInput, {
          target: {
            value: within(originAccountInput).getByText(originAccountName)
              .value,
          },
        });
      }

      if (destinationAccountName) {
        // Enter account
        const destinationAccountInput = wrapper.getByLabelText(
          "Destination Account"
        );
        fireEvent.change(destinationAccountInput, {
          target: {
            value: within(destinationAccountInput).getByText(
              destinationAccountName
            ).value,
          },
        });
      }

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
          value: comment || newTransaction.comment,
        },
      });

      // wait for save button to be enabled
      await waitFor(() => {
        expect(wrapper.getByText("Save").closest("button")).not.toBeDisabled();
      });

      fireEvent.click(wrapper.getByText("Save"));
    };

    it("shows the save button as disabled", async () => {
      await runUserActions();

      expect(
        (await wrapper.findByText("Save")).closest("button")
      ).toBeDisabled();
    });

    describe("database has accounts", () => {
      let accounts;
      beforeEach(async () => {
        mockTable("accounts").set(repeat(accountMock, 5));

        accounts = await mockTable("accounts").toArray();
      });

      it("shows save button disabled", async () => {
        await runUserActions();

        expect(
          (await wrapper.findByText("Save")).closest("button")
        ).toBeDisabled();
      });

      describe("database has categories", () => {
        beforeEach(async () => {
          mockTable("categories").set(repeat(categoryMock, 5));
          mockTable("incomeCategories").set(repeat(categoryMock, 5));
        });

        const expectToBeInTransactionsPage = async () => {
          // Test we are in transaction page by expecting the new transaction button to be shown
          await wrapper.findByText("New Transaction");
        };

        it("shows the save button as enabled", async () => {
          await runUserActions();

          expect(
            (await wrapper.findByText("Save")).closest("button")
          ).not.toBeDisabled();
        });

        it("shows the expense categories", async () => {
          await runUserActions();

          const expenseCategories = await mockTable("categories").toArray();

          await waitFor(() => {
            expenseCategories.forEach((cat) => {
              wrapper.getByText(cat.name);
            });
          });
        });

        describe("when some categories are deactivated", () => {
          let activeCategories;
          let deactivatedCategories;
          beforeEach(async () => {
            activeCategories = await mockTable("categories").toArray();

            deactivatedCategories = repeat(
              () =>
                categoryMock({ deactivatedAt: DateTime.local().toSeconds() }),
              5
            );

            mockTable("categories").set([
              ...activeCategories,
              ...deactivatedCategories,
            ]);
          });

          it("only shows active categories", async () => {
            await runUserActions();

            await waitFor(() => {
              activeCategories.forEach((category) => {
                wrapper.getByText(category.name);
              });

              deactivatedCategories.forEach((category) => {
                expect(wrapper.queryByText(category.name)).toBeNull();
              });
            });
          });
        });

        describe("user selects income transaction", () => {
          userAction(async () => {
            selectTransactionTypeInForm("income");

            // Avoid act() warning
            await waitFor(() => {});
          });

          it("shows the income categories", async () => {
            await runUserActions();

            const expenseCategories = await mockTable(
              "incomeCategories"
            ).toArray();

            await waitFor(() => {
              expenseCategories.forEach((cat) => {
                wrapper.getByText(cat.name);
              });
            });
          });
        });

        describe("user selects transfer transaction", () => {
          userAction(async () => {
            selectTransactionTypeInForm("transfer");

            // Avoid act() warning
            await waitFor(() => {});
          });

          it("does not show category field", async () => {
            await runUserActions();

            await waitFor(() => {
              expect(wrapper.queryByLabelText("Category")).toBeNull();
            });
          });
        });

        describe("user creates an income transaction", () => {
          let selectedAccount;
          userAction(async () => {
            [selectedAccount] = accounts;

            await createTransactionInForm({
              accountName: selectedAccount.name,
              type: "income",
            });

            // Avoid act() warning
            await waitFor(() => {});
          });

          it("correctly assosiates transaction to account", async () => {
            await runUserActions();

            // Test the account was associated by looking for it in the transactions page
            // First make sure we are in transactions page
            await expectToBeInTransactionsPage();

            await wrapper.findByText(selectedAccount.name, { exact: false });
          });
        });

        describe("user creates an expense transaction", () => {
          let selectedAccount;
          userAction(async () => {
            [selectedAccount] = accounts;

            await createTransactionInForm({
              accountName: selectedAccount.name,
              type: "expense",
            });
          });

          it("correctly assosiates transaction to account", async () => {
            await runUserActions();

            // Test the account was associated by looking for it in the transactions page
            // First make sure we are in transactions page
            await expectToBeInTransactionsPage();

            await wrapper.findByText(selectedAccount.name, { exact: false });
          });
        });

        describe("user creates a transfer transaction", () => {
          let originAccount;
          let destinationAccount;
          userAction(async () => {
            [originAccount, destinationAccount] = accounts;

            await createTransactionInForm({
              originAccountName: originAccount.name,
              destinationAccountName: destinationAccount.name,
              type: "transfer",
            });

            // Avoid missing act() warning
            await waitFor(() => {});
          });

          it("correctly assosiates transactions to account", async () => {
            await runUserActions();

            // Test the account was associated by looking for it in the transactions page
            // First make sure we are in transactions page
            await expectToBeInTransactionsPage();

            await wrapper.findByText(originAccount.name, { exact: false });
            await wrapper.findByText(destinationAccount.name, { exact: false });
          });
        });
      });
    });

    describe("user enters transaction fields", () => {
      const newTransaction = transactionMock();
      newTransaction.type = "transfer";

      userAction(async () => {
        await createTransactionInForm({
          type: "transfer",
          amount: newTransaction.amount,
          comment: newTransaction.comment,
        });

        // Avoid missing act() warning
        await waitFor(() => {});
      });

      describe("database has at least 1 account", () => {
        beforeEach(() => {
          mockTable("accounts").set([accountMock()]);
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
      beforeEach(async () => {
        mockTable("accounts").set([accountMock()]);
        const [account] = await mockTable("accounts").toArray();

        mockTable("transactions").set([
          transactionMock({ type: "income", accountId: account.id }),
        ]);
      });

      it("does not let the user delete the account", async () => {
        await runUserActions();

        expect(
          wrapper.baseElement.querySelector("[aria-label='delete']").disabled
        ).toBeTruthy();
      });
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
      let categories;
      let accounts;
      beforeEach(async () => {
        mockTable("categories").set(repeat(categoryMock, 4));
        mockTable("accounts").set(repeat(accountMock, 4));

        categories = await mockTable("categories").toArray();
        accounts = await mockTable("accounts").toArray();
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
        let transactions;
        beforeEach(async () => {
          const accountsLength = accounts.length;
          mockTable("transactions").set(
            repeat(
              (idx) =>
                transactionMock({
                  accountId: accounts[(idx * 1 + 1) % accountsLength].id,
                  originAccountId: accounts[(idx * 2 + 3) % accountsLength].id,
                  destinationAccountId:
                    accounts[(idx * 3 + 4) % accountsLength].id,
                }),
              50
            )
          );
          transactions = await mockTable("transactions").toArray();
        });

        it("shows the amount in the account for each account", async () => {
          await runUserActions();

          const { accountAmounts } = getTransactionsStats(transactions);

          accounts.forEach((account) => {
            wrapper.getByText(
              `${currencyFormat(accountAmounts[account.id] || 0)}`
            );
          });
        });
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
