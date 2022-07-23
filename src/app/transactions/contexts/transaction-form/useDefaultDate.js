import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
import { parseSearchParams } from "../../../../utils";

const useDefaultDate = () => {
  const location = useLocation();

  const { month, year, day } = parseSearchParams(location.search);

  const currentDate = DateTime.now();

  if (month && year && day) {
    return DateTime.fromObject({
      year,
      month,
      day,
      hour: currentDate.hour,
      minute: currentDate.minute,
      second: currentDate.second,
    });
  }

  if (`${currentDate.month}` === month && `${currentDate.year}` === year) {
    // selected month is today's month
    return currentDate;
  }

  const selectedDate = DateTime.fromObject({ month, year });

  if (currentDate > selectedDate) {
    // selected month is a past month
    return selectedDate.endOf("month");
  }

  // selected month is a future month

  return selectedDate.startOf("month");
};

export default useDefaultDate;
