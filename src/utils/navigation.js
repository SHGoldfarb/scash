import { isString } from "../lib";

export const transactionsPathName = "transactions";
export const settingsPathName = "settings";
export const editPathName = "edit";
export const objectivesPathName = "objectives";

export const stringifySearchParams = (params) =>
  new URLSearchParams(params).toString();

export const parseSearchParams = (searchString) =>
  [...new URLSearchParams(searchString).entries()].reduce(
    (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
    {}
  );

export const makePath = (...args) =>
  args
    .map((arg) => {
      if (isString(arg)) {
        return `/${arg}`;
      }
      const { params } = arg;
      const searchParams = new URLSearchParams(params);
      return `?${searchParams.toString()}`;
    })
    .join("");
