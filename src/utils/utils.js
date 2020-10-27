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