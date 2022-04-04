import { existsSync, mkdirSync, writeFile } from "fs";

export const isString = (variable) => {
  return !!(typeof variable === "string" || variable instanceof String);
};

export const oneOfOrNull = (options) => (choice) =>
  options.includes(choice) ? choice : null;

export const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

export const writeFileAsync = (filename, content) =>
  new Promise((resolve) => {
    const dir = filename.split("/").slice(0, -1).join("/");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFile(filename, content, (err) => {
      if (err) throw err;
      resolve();
    });
  });

// Errors

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
