const validators = {
  accounts: (account) => ({
    id: account.id || null,
    name: account.name || null,
  }),
};

export default validators;
