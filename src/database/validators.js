const blankValues = [undefined, null];

const includeIfNotBlank = (attrName) => (validator) => (item) => {
  const validated = validator(item);
  if (!blankValues.includes(item[attrName])) {
    validated[attrName] = item[attrName];
  }
  return validated;
};

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
  }),
};

const validators = (tableName) =>
  includeIfNotBlank("id")(validatorsObject[tableName] || ((value) => value));

export default validators;
