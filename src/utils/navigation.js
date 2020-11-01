export const transactionsPathName = "transactions";
export const settingsPathName = "settings";
export const editPathName = "edit";

export const makePath = (...args) => args.map((arg) => `/${arg}`).join("");
