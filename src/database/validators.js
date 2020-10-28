const validatorsObject = {
  accounts: (account) => ({
    id: account.id || null,
    name: account.name || null,
  }),
  categories: (category) => ({
    id: category.id || null,
    name: category.name || null,
  }),
};

const validators = (tableName) =>
  validatorsObject[tableName] || ((value) => value);

export default validators;
