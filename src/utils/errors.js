export const throwError = (ErrorClass, ...args) => {
  throw new ErrorClass(...args);
};
