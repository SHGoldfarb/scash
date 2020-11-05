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
  }),
  categories: (category) => ({
    name: category.name || null,
  }),
  transactions: (transaction) => ({
    amount: transaction.amount ? parseInt(transaction.amount, 10) : 0,
    comment: transaction.comment || "",
    date:
      transaction.date ||
      throwError(
        TypeError,
        `Transaction date is not valid: ${transaction.date}`
      ),
    type:
      included(["income", "expense", "transfer"])(transaction.type) ||
      "expense",
  }),
};

const validators = (tableName) =>
  includeIfNotBlank("id")(validatorsObject[tableName] || ((value) => value));

export default validators;
