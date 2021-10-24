export const isEnterKey = (ev) =>
  ev.keyCode === 13 || ev.code === "Enter" || ev.key === "Enter";

export const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

export const upsertBy = (attrName, array, item) => {
  let inserted;
  const newArray = array.map((arrayItem) => {
    if (arrayItem[attrName] === item[attrName]) {
      inserted = true;
      return item;
    }
    return arrayItem;
  });

  if (!inserted) {
    newArray.push(item);
  }

  return newArray;
};

export const upsertById = (array, item) => upsertBy("id", array, item);

export const repeat = (func, times) =>
  [...new Array(times)].map((_, idx) => func(idx));

export const asyncReduce = (asyncFunctions) =>
  asyncFunctions.reduce(
    async (previousPromise, asyncFunction) =>
      asyncFunction(await previousPromise),
    Promise.resolve(null)
  );

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const currencyFormat = (amount) => {
  return formatter.format(amount).slice(0, -3);
};

export const isString = (variable) => {
  return !!(typeof variable === "string" || variable instanceof String);
};

export const by = (getter) => {
  if (isFunction(getter)) {
    return (a, b) => (getter(a) < getter(b) ? -1 : 1);
  }

  return (a, b) => (a[getter] < b[getter] ? -1 : 1);
};

export const isActive = (entity) => !entity.deactivatedAt;

export const sample = (items) =>
  items[Math.floor(Math.random() * items.length)];

export const waitms = async (ms) => {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  return promise;
};

export const getTransactionsStats = (transactions) =>
  transactions.reduce(
    ({ accountAmounts }, transaction) => {
      if (transaction.type === "transfer") {
        return {
          accountAmounts: {
            ...accountAmounts,
            [transaction.originAccountId]:
              (accountAmounts[transaction.originAccountId] || 0) -
              transaction.amount,
            [transaction.destinationAccountId]:
              (accountAmounts[transaction.destinationAccountId] || 0) +
              transaction.amount,
          },
        };
      }
      if (transaction.type === "expense") {
        return {
          accountAmounts: {
            ...accountAmounts,
            [transaction.accountId]:
              (accountAmounts[transaction.accountId] || 0) - transaction.amount,
          },
        };
      }
      if (transaction.type === "income") {
        return {
          accountAmounts: {
            ...accountAmounts,
            [transaction.accountId]:
              (accountAmounts[transaction.accountId] || 0) + transaction.amount,
          },
        };
      }
      throw new Error(
        `Transation type is not valid ${JSON.stringify(transaction, null, 2)}`
      );
    },
    { accountAmounts: {} }
  );

export const oneOfOrNull = (options) => (choice) =>
  options.includes(choice) ? choice : null;
