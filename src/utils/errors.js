import { isFunction } from "./utils";

export const throwError = (ErrorClass, ...args) => {
  throw new ErrorClass(...args);
};

export const throwInvalidEntityError = (data, message) =>
  throwError(TypeError, `${message}: ${JSON.stringify(data, null, 2)}`);

export const throwErrorIfNotValid = (data, key, isValid, message) => {
  const value = isFunction(key) ? key(data) : data[key];
  if (isValid(value)) {
    return value;
  }

  throwInvalidEntityError(data, message);

  return null;
};
