import {
  validTransaction,
  validIncomeCategory,
  validAccount,
  validCategory,
} from "../entities";

const validatorsObject = {
  accounts: validAccount,
  categories: validCategory,
  incomeCategories: validIncomeCategory,
  transactions: validTransaction,
};

const blankValues = [undefined, null];

const validators = (tableName) => (item) => {
  const validated = (validatorsObject[tableName] || ((value) => value))(item);
  if (!blankValues.includes(item.id)) {
    validated.id = item.id;
  }
  return validated;
};

export default validators;
