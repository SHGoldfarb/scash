import React from "react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { DateTime } from "luxon";
import { readFileSync } from "fs";
import {
  repeat,
  transactionsTotals,
  currencyFormat,
  getTransactionsStats,
  exportToJSON,
  luxonSecondsToExcelDays,
  excelToJson,
  newId,
} from "utils";
import { utils } from "xlsx";
import App from "./App";
import { mockTable } from "./test-utils/mocks";
import {
  transactionMock,
  accountMock,
  incomeSourceMock,
  objectiveMock,
} from "./test-utils/mocks/entities";
import { makeEventsPoint } from "./test-utils";
import { asyncReduce, writeFileAsync } from "./lib";

jest.mock("dexie", () => {
  return function Dexie() {
    return {
      version: () => ({
        stores: () => ({ upgrade: () => {} }),
        upgrade: () => {},
      }),
      table: (tableName) => mockTable(tableName),
    };
  };
});

describe("App", () => {
  const startOfMonth = () => DateTime.local().startOf("month");

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

  describe("there is a transaction with a closed objective", () => {
    let objective;
    let transaction;
    beforeEach(async () => {
      objective = objectiveMock({ closedAt: DateTime.local().toSeconds() });
      transaction = transactionMock({
        objectiveId: objective.id,
        type: "expense",
        date: DateTime.local().toSeconds(),
      });

      await mockTable("objectives").set([objective]);
      await mockTable("transactions").set([transaction]);
    });

    it("correctly lets user edit the transaction while keeping the objective", async () => {
      await runUserActions();

      // Click in transaction to edit
      fireEvent.click(await wrapper.findByText(transaction.comment));

      // Test objective is displayed in objectives dropdown

      // First we test that the form has opened
      await wrapper.findByText("Delete");

      // Then we look for the objective name
      await wrapper.findByDisplayValue(objective.name);
    });
  });

  const expectTransactionInList = async (transaction) => {
    // comment
    await wrapper.findByText(transaction.comment);
    // amount
    await waitFor(() => {
      expect(
        wrapper.getAllByText(currencyFormat(transaction.amount)).length
      ).toBeTruthy();
    });
    // date
    await wrapper.findByText(
      DateTime.fromSeconds(transaction.date).toFormat("ccc dd")
    );
  };

  describe("user presses next month button", () => {
    userAction(async () => {
      fireEvent.click(await wrapper.findByTestId("NavigateNextIcon"));
    });

    it("shows next month in month selector", async () => {
      await runUserActions();

      const nextMonthDate = DateTime.local().plus({ months: 1 });
      await wrapper.findByText(
        `${nextMonthDate.monthLong} ${nextMonthDate.year}`
      );
    });
  });

  describe("user presses previous month button", () => {
    userAction(async () => {
      fireEvent.click(await wrapper.findByTestId("NavigateBeforeIcon"));
    });

    it("shows previous month in month selector", async () => {
      await runUserActions();

      const prevMonthDate = DateTime.local().plus({ months: -1 });
      await wrapper.findByText(
        `${prevMonthDate.monthLong} ${prevMonthDate.year}`
      );
    });
  });

  describe("database has a single transaction and single account", () => {
    let transaction;
    let account;
    beforeEach(async () => {
      transaction = transactionMock({
        date: startOfMonth().toSeconds(),
        type: "expense",
      });

      account = accountMock({ id: transaction.accountId });

      await mockTable("transactions").set([transaction]);
      await mockTable("accounts").set([account]);
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

          // Avoid act() warning
          await waitFor(() => {});
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

  describe("database has transactions this month", () => {
    let transactionsThisMonth;

    beforeEach(() => {
      // some transactions this month, some transactions previous month
      transactionsThisMonth = repeat(transactionMock, 4).map(
        (transaction, idx) => ({
          ...transaction,
          date: startOfMonth().plus({ days: idx }).toSeconds(),
        })
      );

      mockTable("transactions").set([...transactionsThisMonth]);
    });

    const expectTransactionsInList = async (transactions) => {
      await asyncReduce(
        transactions.map((transaction) => async () => {
          await expectTransactionInList(transaction);
        })
      );
    };

    it("shows total income/expense for month", async () => {
      const { income, expense } = transactionsTotals(transactionsThisMonth);

      await runUserActions();

      await waitFor(() => {
        expect(
          wrapper.getAllByText(currencyFormat(income)).length
        ).toBeTruthy();
        expect(
          wrapper.getAllByText(currencyFormat(expense)).length
        ).toBeTruthy();
      });
    });

    describe("user presses on a transaction", () => {
      let transaction;
      beforeEach(() => {
        [transaction] = transactionsThisMonth;
      });

      userAction(async () => {
        fireEvent.click(await wrapper.findByText(transaction.comment));
      });

      describe("transaction account and objective are in the database", () => {
        beforeEach(async () => {
          // Decoy data
          await mockTable("accounts").put(accountMock());
          await mockTable("objectives").put(objectiveMock());
          await mockTable("incomeSources").put(incomeSourceMock());
          await mockTable("transactions").put(transactionMock());

          // Transaction data
          if (transaction.accountId) {
            await mockTable("accounts").put(
              accountMock({ id: transaction.accountId })
            );
          }
          if (transaction.originAccountId) {
            await mockTable("accounts").put(
              accountMock({ id: transaction.originAccountId })
            );
          }
          if (transaction.destinationAccountId) {
            await mockTable("accounts").put(
              accountMock({ id: transaction.destinationAccountId })
            );
          }
          if (transaction.objectiveId) {
            await mockTable("objectives").put(
              objectiveMock({ id: transaction.objectiveId })
            );
          }
          if (transaction.incomeSourceId) {
            await mockTable("incomeSources").put(
              incomeSourceMock({ id: transaction.incomeSourceId })
            );
          }
        });

        describe("transaction is income", () => {
          beforeEach(() => {
            transaction.type = "income";
          });

          it("shows transaction form with transaction values", async () => {
            // Transaction date should be different than default Date
            transaction.date += 500;

            await runUserActions();

            // Correct type

            await waitFor(() => {
              expect(wrapper.getByLabelText("Type").value).toEqual(
                transaction.type
              );
            });

            // Correct date
            const formattedDate = DateTime.fromSeconds(
              transaction.date
            ).toFormat("yyyy-MM-dd HH:mm");

            await waitFor(() => {
              expect(wrapper.getByLabelText("Date").value).toEqual(
                formattedDate
              );
            });

            // Correct amount
            await waitFor(() => {
              expect(wrapper.getByLabelText("Amount *").value).toEqual(
                `${transaction.amount}`
              );
            });

            // Correct account
            await waitFor(() => {
              expect(wrapper.getByLabelText("Account").value).toEqual(
                `${transaction.accountId}`
              );
            });

            // Correct objective
            await waitFor(() => {
              expect(wrapper.getByLabelText("Income Source").value).toEqual(
                `${transaction.incomeSourceId}`
              );
            });

            // Correct comment
            await waitFor(() => {
              expect(wrapper.getByLabelText("Comment").value).toEqual(
                `${transaction.comment}`
              );
            });
          });
        });

        describe("transaction is transfer", () => {
          beforeEach(() => {
            transaction.type = "transfer";
          });

          it("shows transaction form with correct accounts values", async () => {
            await runUserActions();

            // Correct origin account
            await waitFor(() => {
              expect(wrapper.getByLabelText("Origin Account").value).toEqual(
                `${transaction.originAccountId}`
              );
            });

            // Correct destination acccount
            await waitFor(() => {
              expect(
                wrapper.getByLabelText("Destination Account").value
              ).toEqual(`${transaction.destinationAccountId}`);
            });
          });
        });

        describe("user presses delete button", () => {
          userAction(async () => {
            fireEvent.click(await wrapper.findByText("Delete"));

            // Avoid act() warning
            await waitFor(() => {});
          });

          it("shows transaction list for the correct month and deleted transaction is missing", async () => {
            await runUserActions();

            // Test is in transactions list in the correct month
            await wrapper.findByText(
              DateTime.fromSeconds(transaction.date).toFormat("MMMM yyyy")
            );

            // Test transaction is missing
            expect(wrapper.queryByText(transaction.comment)).toBeNull();
          });
        });
      });
    });

    describe("database has transactions prev month", () => {
      let transactionsPrevMonth;

      beforeEach(async () => {
        const currentTransactions = await mockTable("transactions").toArray();

        transactionsPrevMonth = repeat(transactionMock, 4).map(
          (transaction, idx) => ({
            ...transaction,
            date: startOfMonth()
              .minus({ months: 1 })
              .plus({ days: idx })
              .toSeconds(),
          })
        );

        mockTable("transactions").set([
          ...currentTransactions,
          ...transactionsPrevMonth,
        ]);
      });

      it("shows transactions list for current month", async () => {
        await runUserActions();

        // Avoid missing act() warning
        await waitFor(() => {});

        await expectTransactionsInList(transactionsThisMonth);

        // Make sure it does not show transactions from previous month
        transactionsPrevMonth.forEach((transaction) => {
          expect(
            wrapper.queryByText(transaction.comment, { exact: false })
          ).toBe(null);
        });
      });

      describe("user selects past month", () => {
        // Select previous month
        userAction(async () => {
          fireEvent.click(await wrapper.findByTestId("NavigateBeforeIcon"));
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
    });

    describe("user selects future month", () => {
      // Select next month
      userAction(async () => {
        fireEvent.click(await wrapper.findByTestId("NavigateNextIcon"));
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

      describe("database has objectives", () => {
        beforeEach(async () => {
          mockTable("objectives").set(repeat(objectiveMock, 5));
          mockTable("incomeSources").set(repeat(objectiveMock, 5));
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

        it("shows the expense objectives", async () => {
          await runUserActions();

          const expenseObjectives = await mockTable("objectives").toArray();

          await waitFor(() => {
            expenseObjectives.forEach((cat) => {
              wrapper.getByText(cat.name);
            });
          });
        });

        describe("when some objectives are closed", () => {
          let openObjectives;
          let closedObjectives;
          beforeEach(async () => {
            openObjectives = await mockTable("objectives").toArray();

            closedObjectives = repeat(
              () => objectiveMock({ closedAt: DateTime.local().toSeconds() }),
              5
            );

            mockTable("objectives").set([
              ...openObjectives,
              ...closedObjectives,
            ]);
          });

          it("only shows open objectives", async () => {
            await runUserActions();

            await waitFor(() => {
              openObjectives.forEach((objective) => {
                wrapper.getByText(objective.name);
              });

              closedObjectives.forEach((objective) => {
                expect(wrapper.queryByText(objective.name)).toBeNull();
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

          it("shows the income sources", async () => {
            await runUserActions();

            const expenseObjectives = await mockTable(
              "incomeSources"
            ).toArray();

            await waitFor(() => {
              expenseObjectives.forEach((cat) => {
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

          it("does not show objective field", async () => {
            await runUserActions();

            await waitFor(() => {
              expect(wrapper.queryByLabelText("Objective")).toBeNull();
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
          await wrapper.findByText(newTransaction.comment);
          // amount
          await waitFor(() => {
            expect(
              wrapper.getAllByText(currencyFormat(newTransaction.amount)).length
            ).toBeTruthy();
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

  describe("user presses objectives button", () => {
    userAction(async () => {
      fireEvent.click(wrapper.getByText("Objectives"));

      // Avoid act() warning
      await waitFor(() => {});
    });

    it("correctly lets user merge objectives", async () => {
      const objective1 = objectiveMock({ assignedAmount: newId() * 1000 });
      const objective2 = objectiveMock({ assignedAmount: newId() * 1000 });

      const transaction1 = transactionMock({
        type: "expense",
        objectiveId: objective1.id,
      });
      const transaction2 = transactionMock({
        type: "expense",
        objectiveId: objective2.id,
      });

      await mockTable("objectives").set([objective1, objective2]);
      await mockTable("transactions").set([transaction1, transaction2]);

      await runUserActions();

      // Merge objective1 into objective2
      fireEvent.click(await wrapper.findByText(objective1.name));
      fireEvent.click(await wrapper.findByText("Merge"));
      fireEvent.mouseDown(await wrapper.findByLabelText("Merge into"));
      await waitFor(() => {
        expect(wrapper.getAllByText(objective2.name).length).toEqual(2);
      });
      fireEvent.click(wrapper.getAllByText(objective2.name)[1]);
      fireEvent.click(wrapper.getByText("Save"));

      // Test result
      await waitFor(() => {
        expect(wrapper.queryByText(objective1.name)).toBeNull();
        wrapper.getByText(
          currencyFormat(
            objective1.assignedAmount +
              objective2.assignedAmount -
              transaction1.amount -
              transaction2.amount
          )
        );
      });
    });

    it("correctly lest user create a new objective", async () => {
      await runUserActions();

      // Click new objective button
      fireEvent.click(await wrapper.findByText("New Objective"));

      // Input name and save
      const name = "The name";
      fireEvent.change(await wrapper.findByLabelText("Name"), {
        target: { value: name },
      });
      fireEvent.click(wrapper.getByText("Create"));

      // Test name is found
      await wrapper.findByText(name);
    });

    it("correctly lets user change name of an objective", async () => {
      const objective = objectiveMock();
      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective name
      fireEvent.click(await wrapper.findByText(objective.name));

      // Change objective name
      const newName = "new objective name";
      fireEvent.change(await wrapper.findByDisplayValue(objective.name), {
        target: { value: newName },
      });

      // Click save
      fireEvent.click(wrapper.getByText("Save"));

      // Test new objective name is shown
      await wrapper.findByText(newName);
    });

    it("correctly lets user add amount to objective", async () => {
      const objective = objectiveMock({ assignedAmount: 1000 });
      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective amount
      fireEvent.click(
        await wrapper.findByText(currencyFormat(objective.assignedAmount))
      );

      // Input amount
      const newAmount = 5000;
      fireEvent.change(await wrapper.findByLabelText("Amount"), {
        target: { value: `${newAmount}` },
      });

      // Click add
      fireEvent.click(wrapper.getByText("Add"));

      // Test new objective name is shown
      await wrapper.findByText(
        currencyFormat(newAmount + objective.assignedAmount)
      );
    });

    it("correctly lets user substract amount from objective", async () => {
      const objective = objectiveMock({ assignedAmount: 1000 });
      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective amount
      fireEvent.click(
        await wrapper.findByText(currencyFormat(objective.assignedAmount))
      );

      // Input amount
      const newAmount = 5000;
      fireEvent.change(await wrapper.findByLabelText("Amount"), {
        target: { value: `${newAmount}` },
      });

      // Click add
      fireEvent.click(wrapper.getByText("Subtract"));

      // Test new objective name is shown
      await wrapper.findByText(
        currencyFormat(-newAmount + objective.assignedAmount)
      );
    });

    it("does not let user close objective if it has a nonzero amount", async () => {
      const objective = objectiveMock({ assignedAmount: 1000 });
      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective name
      fireEvent.click(await wrapper.findByText(objective.name));

      // Test delete button is disabled
      expect(await wrapper.findByText("Delete")).toBeDisabled();
    });

    it("correctly lets user close objective", async () => {
      const objective = objectiveMock({ assignedAmount: 0 });
      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective name
      fireEvent.click(await wrapper.findByText(objective.name));

      // Click on delete button
      fireEvent.click(await wrapper.findByText("Delete"));

      // Wait for objective to disappear
      await waitFor(() => {
        expect(wrapper.queryByText(objective.name)).toBeNull();
      });
    });

    it("correctly lets user reopen objective", async () => {
      const objective = objectiveMock({
        assignedAmount: 10000,
        closedAt: DateTime.local(),
      });

      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective name
      fireEvent.click(await wrapper.findByText(objective.name));

      // Click on restore button
      fireEvent.click(await wrapper.findByText("Restore"));

      // Wait for dialog to close
      await waitFor(() => {
        expect(wrapper.queryByText("Restore")).toBeNull();
      });

      // Click again on objective and test for edit name button
      fireEvent.click(await wrapper.findByText(objective.name));
      await wrapper.findByText("Save");
    });

    it("does not show closed objective with zero amount", async () => {
      const objective = objectiveMock({
        assignedAmount: 0,
        closedAt: DateTime.local(),
      });

      mockTable("objectives").set([objective]);

      await runUserActions();

      // Test for everything to load
      await wrapper.findByText("Without objective");

      // Test for objective name not to show
      expect(wrapper.queryByText(objective.name)).toBeNull();
    });

    it("does not let add or subtract amount to closed objective", async () => {
      const objective = objectiveMock({
        assignedAmount: 10000,
        closedAt: DateTime.local(),
      });

      mockTable("objectives").set([objective]);

      await runUserActions();

      // Click on objective amount
      fireEvent.click(
        await wrapper.findByText(currencyFormat(objective.assignedAmount))
      );

      // Test modal doesn't show up
      expect(wrapper.queryByText("Add or Subtract Amount")).toBeNull();
    });
  });

  describe("user presses settings button", () => {
    userAction(async () => {
      fireEvent.click(wrapper.getByText("Settings"));

      // Avoid act() warning
      await waitFor(() => {});
    });

    describe("there is a closed account with nonzero amount", () => {
      beforeEach(async () => {
        const account = accountMock({ closedAt: DateTime.local() });
        await mockTable("accounts").set([account]);

        const transaction = transactionMock({
          accountId: account.id,
          type: "income",
        });

        await mockTable("transactions").set([transaction]);
      });

      describe("user presses reopen account", () => {
        userAction(async () => {
          fireEvent.click(await wrapper.findByTestId("RestoreFromTrashIcon"));
        });

        it("shows as open", async () => {
          await runUserActions();

          await wrapper.findByTestId("EditIcon");
        });
      });
    });

    describe("user converts excel to json and imports json", () => {
      const accountName = "acc1";
      const objectiveName = "cat1";
      const transactionComment = "comm1";
      const transactionDate = DateTime.local();
      const transactionAmount = 5123;
      userAction(async () => {
        // Due to difficulty intercepting downloaded JSON, we will only test the convert function and not the button
        // TODO: test this properly using the UI.

        // Data
        const data = [
          {
            Date: luxonSecondsToExcelDays(transactionDate.toSeconds()),
            Account: accountName,
            Category: objectiveName,
            Note: transactionComment,
            "Income/Expense": "Expense",
            Amount: transactionAmount,
          },
        ];

        const workbook = utils.book_new();
        const dataSheet = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, dataSheet, "sheet1");

        // Convert to JSON and save
        const jsonData = excelToJson(workbook);
        const jsonFilename = "tmp/jsonData1.txt";
        await writeFileAsync(jsonFilename, jsonData);

        // Import
        const input = (
          await wrapper.findByText("Import from JSON")
        ).querySelector("input");

        const buffer = readFileSync(jsonFilename);
        const blob = new Blob([buffer]);

        fireEvent.change(input, { target: { files: [blob] } });
      });

      it("imports info correctly", async () => {
        await runUserActions();

        await wrapper.findByText(accountName);

        fireEvent.click(wrapper.getByText("Objectives"));

        await wrapper.findByText(objectiveName);

        fireEvent.click(wrapper.getByText("Transactions"));

        // Transaction date
        await wrapper.findByText(transactionDate.toFormat("ccc dd"));

        // Transaction amount
        await waitFor(() => {
          expect(
            wrapper.getAllByText(currencyFormat(transactionAmount)).length
          ).toBeTruthy();
        });

        // Transaction comment
        await wrapper.findByText(transactionComment);

        // Account and objective
        await wrapper.findByText(accountName, {
          exact: false,
        });
        await wrapper.findByText(objectiveName);
      });
    });

    describe("user presses export to json button, enters clear command and then imports recently exported json", () => {
      userAction(async () => {
        // Due to difficulty intercepting downloaded JSON, we will only test the export function and not the button
        // TODO: test this properly using the UI.

        const jsonFilename = "tmp/jsonData2.txt";

        // Export
        const jsonData = await exportToJSON();
        await writeFileAsync(jsonFilename, jsonData);

        // Clear
        const commandInput = await wrapper.findByLabelText("Command line");
        fireEvent.change(commandInput, { target: { value: "clear" } });
        fireEvent.focus(commandInput);
        fireEvent.keyPress(commandInput, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });

        // Wait for clear command to finish
        expect(wrapper.getAllByTestId("DeleteIcon").length).toBeGreaterThan(0);
        await waitFor(() => {
          expect(wrapper.queryByTestId("DeleteIcon")).toBeNull();
        });

        // Import
        const input = (
          await wrapper.findByText("Import from JSON")
        ).querySelector("input");

        const buffer = readFileSync(jsonFilename);
        const blob = new Blob([buffer]);

        fireEvent.change(input, { target: { files: [blob] } });
      });

      it("correctly exports and imports info", async () => {
        const incomeTransaction = transactionMock({
          incomeSource: incomeSourceMock(),
          account: accountMock(),
          type: "income",
          date: DateTime.local().toSeconds(), // This month so it's visible on transactions page
        });
        incomeTransaction.incomeSourceId = incomeTransaction.incomeSource.id;
        incomeTransaction.accountId = incomeTransaction.account.id;

        const closedAccount = accountMock({ closedAt: DateTime.local() });
        const closedObjective = objectiveMock({ closedAt: DateTime.local() });

        const expenseTransaction = transactionMock({
          objective: objectiveMock(),
          account: accountMock(),
          type: "expense",
          date: DateTime.local().toSeconds(), // This month so it's visible on transactions page
        });
        expenseTransaction.objectiveId = expenseTransaction.objective.id;
        expenseTransaction.accountId = expenseTransaction.account.id;

        const transferTransaction = transactionMock({
          originAccount: accountMock(),
          destinationAccount: accountMock(),
          type: "transfer",
          date: DateTime.local().toSeconds(), // This month so it's visible on transactions page
        });

        transferTransaction.originAccountId =
          transferTransaction.originAccount.id;
        transferTransaction.destinationAccountId =
          transferTransaction.destinationAccount.id;

        const objectiveWithAssignedAmount = objectiveMock({
          assignedAmount: 1234,
        });

        await mockTable("incomeSources").set([incomeTransaction.incomeSource]);
        await mockTable("objectives").set([
          expenseTransaction.objective,
          closedObjective,
          objectiveWithAssignedAmount,
        ]);
        await mockTable("accounts").set([
          incomeTransaction.account,
          expenseTransaction.account,
          transferTransaction.originAccount,
          transferTransaction.destinationAccount,
          closedAccount,
        ]);
        await mockTable("transactions").set([
          incomeTransaction,
          expenseTransaction,
          transferTransaction,
        ]);

        await runUserActions();

        // Wait for refetches to finish
        await wrapper.findByText(incomeTransaction.incomeSource.name);

        // Closed account
        expect(wrapper.queryByText(closedAccount.name)).toBeNull();

        // Closed objective
        expect(wrapper.queryByText(closedObjective.name)).toBeNull();

        fireEvent.click(wrapper.getByText("Transactions"));

        // Transaction date
        await wrapper.findByText(
          DateTime.fromSeconds(incomeTransaction.date).toFormat("ccc dd")
        );

        // Transaction amount
        await waitFor(() => {
          expect(
            wrapper.getAllByText(currencyFormat(incomeTransaction.amount))
              .length
          ).toBeTruthy();
        });

        // Transaction comment
        await wrapper.findByText(incomeTransaction.comment);

        // Account and source for income
        await wrapper.findByText(incomeTransaction.account.name, {
          exact: false,
        });
        await wrapper.findByText(incomeTransaction.incomeSource.name);

        // Objective for expense
        await wrapper.findByText(expenseTransaction.objective.name);

        // Accounts for transfer
        await wrapper.findByText(transferTransaction.originAccount.name, {
          exact: false,
        });
        await wrapper.findByText(transferTransaction.destinationAccount.name);

        // Objective with assigned amount
        fireEvent.click(await wrapper.findByText("Objectives"));
        await wrapper.findByText(
          currencyFormat(objectiveWithAssignedAmount.assignedAmount)
        );
      });
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

    describe("user enters clear command", () => {
      userAction(async () => {
        const commandInput = await wrapper.findByLabelText("Command line");
        fireEvent.change(commandInput, { target: { value: "clear" } });
        fireEvent.focus(commandInput);
        fireEvent.keyPress(commandInput, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });

        // Avoid act() warning
        await waitFor(() => {});
      });

      it("clears everything", async () => {
        const transaction = transactionMock({
          date: DateTime.local().toSeconds(), // This month so it's visible on transactions page
        });
        const objective = objectiveMock();
        const incomeSource = objectiveMock();
        const account = accountMock();

        await mockTable("objectives").set([objective]);
        await mockTable("incomeSources").set([incomeSource]);
        await mockTable("accounts").set([account]);
        await mockTable("transactions").set([transaction]);

        await runUserActions();

        await waitFor(() => {
          expect(wrapper.queryByText(objective.name)).toBeNull();
        });

        expect(wrapper.queryByText(incomeSource.name)).toBeNull();

        expect(wrapper.queryByText(account.name)).toBeNull();

        fireEvent.click(wrapper.getByText("Transactions"));

        // Wait for transactions page to load
        await wrapper.findByText("New Transaction");

        expect(wrapper.queryByText(transaction.comment)).toBeNull();
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

    describe("user presses the new income source button", () => {
      userAction(async () => {
        const createButton = wrapper.baseElement.querySelectorAll(
          "[aria-label='Create']"
        )[1];

        fireEvent.click(createButton);
      });
      describe("user writes income source name and saves", () => {
        const newIncomeSourceName = "this is an income source";

        userAction(async () => {
          const nameInput = wrapper.baseElement.querySelectorAll("input")[1];

          fireEvent.change(nameInput, {
            target: { value: newIncomeSourceName },
          });

          fireEvent.click(
            wrapper.baseElement.querySelector("[aria-label='save']")
          );

          // Avoid act() warning
          await waitFor(() => {});
        });

        it("adds the new income source to the list", async () => {
          await runUserActions();

          await wrapper.findByText(newIncomeSourceName);
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

          // Avoid act() warning
          await waitFor(() => {});
        });

        it("new account name is shown", async () => {
          await runUserActions();

          await wrapper.findByText(newAccountName);
        });
      });
    });

    describe("database has objectives and accounts", () => {
      let objectives;
      let accounts;
      beforeEach(async () => {
        mockTable("objectives").set(repeat(objectiveMock, 4));
        mockTable("accounts").set(repeat(accountMock, 4));

        objectives = await mockTable("objectives").toArray();
        accounts = await mockTable("accounts").toArray();
      });

      it("shows objectives and accounts", async () => {
        await runUserActions();

        await asyncReduce(
          accounts.map((account) => async () => {
            await wrapper.findByText(account.name);
          })
        );

        fireEvent.click(await wrapper.findByText("Objectives"));

        await asyncReduce(
          objectives.map((objective) => async () => {
            await wrapper.findByText(objective.name);
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
