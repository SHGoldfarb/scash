import {
  validTransaction,
  validIncomeSource,
  validAccount,
  validObjective,
} from "src/entities";

const validatorsObject = {
  accounts: validAccount,
  objectives: validObjective,
  incomeSources: validIncomeSource,
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
