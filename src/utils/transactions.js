import { DateTime } from "luxon";

export const makeIsTransactionInMonthYear = ({ year, month }) => {
  const firstSecond = DateTime.fromObject({ year, month })
    .startOf("month")
    .startOf("day")
    .toSeconds();

  const lastSecond = DateTime.fromObject({ year, month })
    .endOf("month")
    .endOf("day")
    .toSeconds();

  return (transaction) =>
    transaction.date >= firstSecond && transaction.date <= lastSecond;
};
