const blankValues = [undefined, null];

const includeIfNotBlank = (attrName) => (validator) => (item) => {
  const validated = validator(item);
  if (!blankValues.includes(item[attrName])) {
    validated[attrName] = item[attrName];
  }
  return validated;
};

const throwError = (ErrorClass, ...args) => {
  throw new ErrorClass(...args);
};

const included = (options) => (choice) =>
  options.includes(choice) ? choice : null;

const validatorsObject = {
  accounts: (account) => ({
    name: account.name || null,
    deactivatedAt: account.deactivatedAt || null,
  }),
  categories: (category) => ({
    name: category.name || null,
    deactivatedAt: category.deactivatedAt || null,
  }),
  incomeCategories: (category) => ({
    name: category.name || null,
    deactivatedAt: category.deactivatedAt || null,
  }),
  transactions: (transaction) => ({
    amount: transaction.amount ? parseInt(transaction.amount, 10) : 0,
    comment: transaction.comment || "",
    date:
      transaction.date ||
      throwError(
        TypeError,
        `Transaction must include a date: ${JSON.stringify(
          transaction,
          null,
          2
        )}`
      ),
    type:
      included(["income", "expense", "transfer"])(transaction.type) ||
      "expense",
    accountId: included(["income", "expense"])(transaction.type)
      ? transaction.accountId ||
        throwError(
          TypeError,
          `Transaction must include an accountId: ${JSON.stringify(
            transaction,
            null,
            2
          )}`
        )
      : null,
  }),
};

const validators = (tableName) =>
  includeIfNotBlank("id")(validatorsObject[tableName] || ((value) => value));

export default validators;
