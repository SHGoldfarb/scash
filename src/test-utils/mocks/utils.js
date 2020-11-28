let currentId = 0;
export const newId = () => {
  currentId += 1;
  return currentId;
};
